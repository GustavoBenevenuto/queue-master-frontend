export interface OrderExtraField {
  name: 'printText' | 'itemName' | 'wireName' | 'lengthMm'
  label: string
  type?: 'text' | 'number'
}

/** Fields specific to each section's create form, on top of the shared base fields. */
export const QUEUE_EXTRA_FIELDS: Record<string, OrderExtraField[]> = {
  printing: [{ name: 'printText', label: 'Print text' }],
  'wire-cutting': [
    { name: 'wireName', label: 'Wire' },
    { name: 'lengthMm', label: 'Length (mm)', type: 'number' },
  ],
  'stock-withdrawal': [{ name: 'itemName', label: 'Item' }],
}
