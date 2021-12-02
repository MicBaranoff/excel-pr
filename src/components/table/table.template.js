const CODES = {
  A: 65,
  Z: 90,
}
function toCell(cell) {
  return `
    <div class="cell" contenteditable data-placeholder="${cell}"></div>
  `
}
function toColumn(col) {
  return `
    <div class="column">${col}</div>
  `
}
function createRow(content, index = '') {
  return `
    <div class="row">
        <div class="row-info">${index}</div>
        <div class="row-data">${content}</div>
    </div>
  `
}

function toChar(_, index) {
  return String.fromCharCode(CODES.A + index)
}

export function createTable(rowsCount = 15) {
  const colsCount = CODES.Z - CODES.A + 1
  const rows = []

  const cols = new Array(colsCount)
      .fill('')
      .map(toChar)
      .map(toColumn)
      .join('')

  const cells = (id) => {
    return new Array(colsCount)
        .fill('')
        .map((el, index) => {
          return toChar('', index) + id
        })
        .map(toCell)
        .join('')
  }

  rows.push(createRow(cols))

  for (let i=0; i < rowsCount; i++) {
    const index = i +1
    rows.push(createRow(cells(index), index))
  }
  return rows.join('')
}
