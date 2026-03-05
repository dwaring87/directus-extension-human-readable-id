import InterfaceComponent from './interface.vue';
import getAdjectives from "./assets/adjectives";
import getColors from "./assets/colors";
import getAnimals from "./assets/animals";

export default {
  id: 'human-readable-id',
  name: 'Human Readable ID',
  icon: 'badge',
  description: 'Generate a human-readable text id (e.g. "happy-blue-penguin")',
  component: InterfaceComponent,
  options: [
    {
      field: 'delim',
      type: 'string',
      name: 'Delimiter',
      meta: {
        width: 'half',
        interface: 'input',
        options: {
          placeholder: '-',
        }
      },
    },
    {
      field: 'adjectives',
      type: 'json',
      name: 'Adjectives',
      meta: {
        width: 'full',
        interface: 'tags',
        options: {
          presets: getAdjectives(),
        }
      },
    },
    {
      field: 'colors',
      type: 'json',
      name: 'Colors',
      meta: {
        width: 'full',
        interface: 'tags',
        options: {
          presets: getColors(),
        }
      },
    },
    {
      field: 'animals',
      type: 'json',
      name: 'Animals',
      meta: {
        width: 'full',
        interface: 'tags',
        options: {
          presets: getAnimals(),
        }
      },
    },
  ],
  types: ['string', 'text']
};