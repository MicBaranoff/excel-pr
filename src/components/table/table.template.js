const CODES = {
  A: 65,
  Z: 90,
}
function toCell(cell) {
  return `
    <div class="cell" contenteditable data-cellid="${cell}"></div>
  `
}
function toResizer(type) {
  return `<div class="${type}-resize resize-shadow"
          data-resizetype="${type}"></div>`
}
function toColumn(col) {
  return `
    <div class="column" data-colid="${col}">
        ${col}
        <div class="col-resize resize-btn"  data-resize="col"></div>
    </div>
  `
}
function createRow(content, index = '') {
  return `
    <div class="row" data-rowid="${index !== 0 ? index : ''}">
        <div class="row-info">
            ${index !== 0 ? index : ''}
            ${index !== 0
              ? '<div class="row-resize resize-btn" data-resize="row"></div>'
              : ''}
        </div>
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

  rows.push(createRow(cols, 0))

  for (let i=0; i < rowsCount; i++) {
    const index = i +1
    rows.push(createRow(cells(index), index))
  }
  rows.unshift(toResizer('col'), toResizer('row'))
  return rows.join('')
}
