<template>
  <div class="human-readable-id">
    <v-input :model-value="value" @input="onInputChange($event.target.value)" disabled>
      <template #prepend>
        <v-icon name="badge" />
      </template>
    </v-input>
    <v-button @click="edit" icon><v-icon name="edit" /></v-button>
  </div>

  <v-dialog v-model="editActive" @esc="editActive = false" >
    <v-card>
      <v-card-title>Choose the components of the ID</v-card-title>
      <v-card-text>
        <table style="width: 100%; border: 0">
          <tr>
            <td><strong>Adjective</strong></td>
            <td><v-select v-model="editAdjective" :items="_adjectives.sort().map(v => ({text: v, value: v}))" allow-other /></td>
          </tr>
          <tr>
            <td><strong>Color</strong></td>
            <td><v-select v-model="editColor" :items="_colors.sort().map(v => ({text: v, value: v}))" allow-other /></td>
          </tr>
          <tr>
            <td><strong>Animal</strong></td>
            <td><v-select v-model="editAnimal" :items="_animals.sort().map(v => ({text: v, value: v}))" allow-other /></td>
          </tr>
        </table>

        <VNotice type="warning" v-if="otherDelim">
          <div>
            <p>Unexpected delimiter: "{{ otherDelim }}" (expected "{{ delim || '-' }}")</p>
            <v-button @click="otherDelim = null" v-if="otherDelim">Reset delimeter?</v-button>
          </div>
        </VNotice>

        <VNotice type="danger" v-if="editAdjective && (!editColor || !editAnimal)">
          Could not parse value into 3 parts. Please enter each part manually.
        </VNotice>

        <div class="hri-preview">
          <VChip :large="true">
            {{ formatValue() }}
          </VChip>
          <v-button @click="refresh" icon><v-icon name="refresh" /></v-button>
        </div>

      </v-card-text>
      <v-card-actions>
        <v-button @click="editActive = false" outlined>Cancel</v-button>
        <v-button @click="save" v-if="value !== (formatValue() || value)">Update</v-button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import getAdjectives from "./assets/adjectives";
  import getColors from "./assets/colors";
  import getAnimals from "./assets/animals";
  import { generate } from './hri';

  export default {
    props: {
      delim: {
        type: String,
        default: '-',
      },
      adjectives: {
        type: Array,
        default: getAdjectives()
      },
      colors: {
        type: Array,
        default: getColors()
      },
      animals: {
        type: Array,
        default: getAnimals()
      },
      value: {
        type: String,
        default: null,
      }
    },

    data: function() {
      return {
        otherDelim: null,
        editActive: false,
        editAdjective: undefined,
        editColor: undefined,
        editAnimal: undefined
      }
    },

    computed: {
      _delim() {
        return this.delim || '-';
      },
      _adjectives() {
        return this.adjectives && this.adjectives !== null ? this.adjectives : getAdjectives();
      },
      _colors() {
        return this.colors && this.colors !== null ? this.colors : getColors();
      },
      _animals() {
        return this.animals && this.animals !== null ? this.animals : getAnimals();
      }
    },

    emits: ['input'],

    mounted: function() {
      if ( !this.value ) {
        let init = generate(this._adjectives, this._colors, this._animals, this._delim);
        this.$emit('input', init);
      }
    },

    methods: {
      formatValue: function() {
        let parts = [this.editAdjective, this.editColor, this.editAnimal].filter(x => x);
        return parts.join(this.otherDelim || this._delim);
      },

      /**
       * Manually choose the components of the id
       */
      edit: function() {
        let parts = [];
        if ( this.value ) {
          parts = this.value?.split(this._delim) || [];
          if ( parts.length > 3 ) {
            let [p1, p2, ...rest] = parts;
            parts = [p1, p2, rest.join(this._delim)];
          }
          
          // Check for unexpected delimiter
          if ( parts.length !== 3 ) {
            let delim = this.value.match(/[^a-zA-Z0-9]+/);
            if (delim && delim[0] !== (this._delim) ) {
              this.otherDelim = delim[0];
              parts = this.value?.split(this.otherDelim) || [];
              if ( parts.length > 3 ) {
                let [p1, p2, ...rest] = parts;
                parts = [p1, p2, rest.join(this._delim)];
              }
            }
          }
        }
        [this.editAdjective, this.editColor, this.editAnimal] = parts;
        this.editActive = true;
      },

      /**
       * Save manually edited properties
       */
      save: function() {
        let value = this.formatValue();
        if ( value ) {
          this.$emit('input', value);
        }
        this.editActive = false;
        this.otherDelim = null;
      },

      /**
       * Get a new human-readable-id for the value
       */
      refresh: function() {
        let value = generate(this._adjectives, this._colors, this._animals, this._delim);
        [this.editAdjective, this.editColor, this.editAnimal] = value.split(this._delim);
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
  .hri-preview {
    margin-top: 30px;
    display: flex;
    justify-content: stretch;
    gap: 10px;
  }
  .hri-preview .v-chip {
    font-size: 1.5em;
    font-weight: 900;
    flex-grow: 1;
    justify-content: center;
  }
</style>