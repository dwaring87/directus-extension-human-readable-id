<template>
  <div class="human-readable-id">
    <v-input :model-value="value" @input="onInputChange($event.target.value)" disabled>
      <template #prepend>
        <v-icon name="badge" />
      </template>
    </v-input>
    <v-button @click="edit" icon><v-icon name="edit" /></v-button>
    <v-button @click="refresh" icon><v-icon name="refresh" /></v-button>
  </div>

  <v-dialog v-model="editActive" @esc="editActive = false" >
    <v-card>
      <v-card-title>Choose the components of the ID</v-card-title>
      <v-card-text>
        <table style="width: 100%; border: 0">
          <tr>
            <td><strong>Adjective</strong></td>
            <td><v-select v-model="editAdjective" :items="adjectives.map(v => ({text: v, value: v}))" allow-other /></td>
          </tr>
          <tr>
            <td><strong>Color</strong></td>
            <td><v-select v-model="editColor" :items="colors.map(v => ({text: v, value: v}))" allow-other /></td>
          </tr>
          <tr>
            <td><strong>Animal</strong></td>
            <td><v-select v-model="editAnimal" :items="animals.map(v => ({text: v, value: v}))" allow-other /></td>
          </tr>
        </table>
      </v-card-text>
      <v-card-actions>
        <v-button @click="editActive = false" outlined>Cancel</v-button>
        <v-button @click="save">Save</v-button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { adjectives, colors, animals, generate } from './hri';

  export default {
    props: {
      value: {
        type: String,
        default: null,
      }
    },

    data: function() {
      return {
        delim: '-',
        adjectives: adjectives,
        colors: colors,
        animals: animals,
        editActive: false,
        editAdjective: undefined,
        editColor: undefined,
        editAnimal: undefined
      }
    },

    emits: ['input'],

    mounted: function() {
      if ( !this.value ) {
        let init = generate(this.delim);
        this.$emit('input', init);
      }
    },

    methods: {

      /**
       * Manually choose the components of the id
       */
      edit: function() {
        if ( this.value ) {
          let parts = this.value.split(this.delim);
          if ( parts.length === 3 ) {
            this.editAdjective = parts[0];
            this.editColor = parts[1];
            this.editAnimal = parts[2];
          }
        }
        this.editActive = true;
      },

      /**
       * Save manually edited properties
       */
      save: function() {
        let value = [this.editAdjective, this.editColor, this.editAnimal].join(this.delim);
        this.$emit('input', value);
        this.editActive = false;
      },

      /**
       * Get a new human-readable-id for the value
       */
      refresh: function() {
        let value = generate(this.delim);
        this.$emit('input', value);
      },

      /**
       * Emit changes to the input to the parent
       */
      onInputChange: function(value) {
        this.$emit('input', value);
      }

    }
  };
</script>

<style scoped>
  .human-readable-id {
    display: flex;
    justify-content: space-between;
    gap: 15px;
  }
</style>