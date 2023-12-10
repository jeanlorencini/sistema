<template>
  <div class="mt-4">
    <label for="jogo-select" class="block text-sm font-medium text-gray-700">Selecione um jogo</label>
    <select id="jogo-select" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm">
      <option value="">Selecione um...</option>
      <option v-for="jogo in jogos" :key="jogo" :value="jogo">{{ jogo }}</option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jogos: []
    };
  },
  mounted() {
    this.carregarJogos();
  },
  methods: {
    carregarJogos() {
      fetch("/listar-jogos", {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.nomes_jogos) {
          this.jogos = data.nomes_jogos;
        }
      })
      .catch(err => console.error(err));
    }
  }
};
</script>

<style>
  /* Estilos Tailwind ou CSS personalizados */
</style>
