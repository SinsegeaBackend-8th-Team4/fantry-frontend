<script setup>
/**
 * BaseDataTable.vue
 * - DataTables 기본 설정 래퍼
 * - 데이터: 배열 또는 () => Promise<[]> 형태 지원
 * - 컬럼: datatables.net 형식 그대로 전달
 * - 커스터마이징: 슬롯 (loading / empty / error) & cell-[data] 슬롯
 */
import { ref, onMounted, watch, computed } from 'vue';
import DataTable from 'datatables.net-vue3';
import DataTableCore from 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
DataTable.use(DataTableCore);

const props = defineProps({
  columns: { type: Array, required: true },
  data: { type: [Array, Function], required: true },
  options: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false },
  autoLoad: { type: Boolean, default: true },
  /** 서버사이드 모드(외부 구성)에서 DataTables paging 비활성 등 필요시 */
  bare: { type: Boolean, default: false }
});

const emit = defineEmits(['loaded', 'error']);

const rows = ref([]);
const isLoading = ref(false);
const error = ref(null);

const resolvedOptions = computed(() => ({
  paging: !props.bare,
  searching: false,
  ordering: true,
  info: !props.bare,
  responsive: true,
  language: {
    emptyTable: '데이터가 없습니다.',
    paginate: { previous: '이전', next: '다음' }
  },
  ...props.options
}));

async function load() {
  if (props.loading) return; // 외부 제어 우선
  if (Array.isArray(props.data)) {
    rows.value = props.data;
    emit('loaded', rows.value);
    return;
  }
  try {
    isLoading.value = true;
    error.value = null;
    const result = await props.data();
    rows.value = Array.isArray(result) ? result : [];
    emit('loaded', rows.value);
  } catch (e) {
    error.value = e;
    emit('error', e);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => { if (props.autoLoad) load(); });
watch(() => props.data, () => { if (props.autoLoad) load(); });

// cell 슬롯 지원: cell-필드명 존재 시 render 커스터마이징
const enhancedColumns = computed(() => props.columns.map(col => {
  if (!col.data) return col;
  return {
    ...col,
    render: (data, type, row, meta) => {
      const slotName = `cell-${col.data}`;
      // runtime에서 슬롯이 존재하면 placeholder span 반환 → template에서 교체
      if (slots[slotName]) {
        return `<span data-dt-slot="${slotName}" data-row-index="${meta.row}"></span>`;
      }
      return col.render ? col.render(data, type, row, meta) : data;
    }
  };
}));

const tableRef = ref();
const slots = defineSlots();

/**
 * DataTables draw 완료 후 custom cell 슬롯 마운트
 */
function hydrateSlots() {
  if (!tableRef.value) return;
  const rootEl = tableRef.value.$el || tableRef.value;
  const placeholders = rootEl.querySelectorAll('[data-dt-slot]');
  placeholders.forEach(ph => {
    const slotName = ph.getAttribute('data-dt-slot');
    const rowIndex = Number(ph.getAttribute('data-row-index'));
    const rowData = rows.value[rowIndex];
    // Vue 동적 마운트: 간단히 innerHTML 교체 (복잡 슬롯은 추후 Portal 고려)
    // 여기서는 단순 text/HTML 템플릿만 권장
    const vnode = slots[slotName]?.({ value: rowData[slotName.replace('cell-','')], row: rowData });
    if (Array.isArray(vnode) && vnode.length) {
      // vnode[0].children 가 문자열/배열일 수 있음 -> toString fallback
      const content = vnode.map(v => (v.children ?? '')).join('');
      ph.innerHTML = content;
    }
  });
}

// DataTables 후킹: 간단히 MutationObserver 사용 (최소 구현)
const observer = new MutationObserver(() => hydrateSlots());
function observe() {
  const el = tableRef.value?.$el || tableRef.value;
  if (!el) return;
  const tbody = el.querySelector('tbody');
  if (tbody) observer.observe(tbody, { childList: true, subtree: true });
}

onMounted(() => {
  setTimeout(() => { hydrateSlots(); observe(); }, 50);
});
</script>

<template>
  <div class="base-datatable-wrapper">
    <slot name="loading" v-if="isLoading || loading">로딩중...</slot>
    <div v-else-if="error">
      <slot name="error" :error="error">에러가 발생했습니다.</slot>
    </div>
    <div v-else-if="rows.length === 0">
      <slot name="empty">표시할 데이터가 없습니다.</slot>
    </div>
    <DataTable
      v-else
      ref="tableRef"
      class="table table-striped table-hover align-middle"
      :data="rows"
      :columns="enhancedColumns"
      :options="resolvedOptions"
    />
  </div>
</template>

<style scoped>
.base-datatable-wrapper { width:100%; }
</style>
