export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message
}
export const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
]
