<script setup lang="ts">
import { useCurrencyInput } from 'vue-currency-input';

const props = defineProps({ modelValue: Number });

const { inputRef, setValue } = useCurrencyInput({
  currency: 'BRL',
  // hideCurrencySymbolOnFocus: false,
  // hideGroupingSeparatorOnFocus: false,
  precision: 2,
  valueRange: { min: 0 },
  locale: 'pt-BR'
});

watch(
  () => props.modelValue,
  (value) => {
    setValue(value!);
  }
);

</script>

<template>
    <UInput 
    ref="inputRef"
    type="text"
    />
  
</template>