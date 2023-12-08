<template>
  <div class="w-full">
    <div
      class="container mx-auto flex justify-center [&_input]:hidden p-2 bg-slate-50 [&:has(#a:checked)>#aa]:bg-slate-500 [&:has(#a:checked)+.menu-content>#aaa]:block [&:has(#b:checked)>#bb]:bg-slate-500 [&:has(#b:checked)+.menu-content>#bbb]:block [&:has(#c:checked)>#cc]:bg-slate-500 [&:has(#c:checked)+.menu-content>#ccc]:block [&:has(#d:checked)>#dd]:bg-slate-500 [&:has(#d:checked)+.menu-content>#ddd]:block [&>label]:cursor-pointer"
    >
      <label
        v-for="key in ['a', 'b', 'c', 'd']"
        v-bind:for="key"
        v-bind:id="key + key"
        class="py-1 px-6 m-2 bg-slate-200 rounded-xl"
      >
        <input type="radio" name="test" v-bind:id="key" class="peer" />
        <div class="peer-checked:underline select-none">{{ key }}</div>
      </label>
    </div>
    <div class="container mx-auto menu-content bg-slate-100">
      <div v-for="key in ['aaa', 'bbb', 'ccc', 'ddd']" class="hidden" :id="key">
        {{ key }}: Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam commodi minus
        expedita sint aperiam obcaecati earum vero nemo ab blanditiis in, quo quis. Facere
        voluptates culpa est? At, quaerat consequatur!
      </div>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus id error, sapiente quidem
        quod ratione enim alias laborum voluptates ea consequatur sequi dolore sit ab ex quasi vel
        recusandae numquam!
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet tempora perspiciatis illo
        unde officia amet veniam recusandae nostrum itaque quae. Earum blanditiis repellendus ab
        alias temporibus, non nemo dicta reiciendis?
      </p>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam cumque eos natus
        deserunt harum, aut repellendus? Laudantium consectetur illo eligendi dolorum vero at
        repudiandae quos cupiditate, consequuntur hic! Natus, incidunt?
      </p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
