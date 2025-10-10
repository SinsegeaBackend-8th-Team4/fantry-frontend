<script setup>
import { ref } from 'vue'
import CardHeader from './atoms/CardHeader.vue'
import RadioButton from '@/components/common/atoms/RadioButton.vue'
import { Payment } from '@/module/paymentModule'

const selectedPayment = ref(null)
</script>
<template>
  <div class="card border-secondary mb-5">
    <CardHeader>결제방식</CardHeader>
    <div class="card-body d-flex flex-column">
      <RadioButton v-model="selectedPayment" id="card" name="payment" value="card">
        신용/체크카드
      </RadioButton>
      <RadioButton v-model="selectedPayment" id="no-bankbook" name="payment" value="no-bankbook">
        무통장입금
      </RadioButton>
      <RadioButton v-model="selectedPayment" id="kakao" name="payment" value="kakao">
        카카오뱅크
      </RadioButton>
      <RadioButton v-model="selectedPayment" id="paypal" name="payment" value="paypal">
        Paypal
      </RadioButton>
    </div>
  </div>
</template>
<style scoped></style>
