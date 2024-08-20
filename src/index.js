import InterfaceComponent from './interface.vue';

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
      name: 'Delimeter',
      meta: {
        width: 'half',
        interface: 'input',
        options: {
          placeholder: '-',
        }
      },
    },
  ],
  types: ['string', 'text']
};