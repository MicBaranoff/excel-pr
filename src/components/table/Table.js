import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from '@/components/table/table.template'
import {$} from '@/core/dom.js'

export class Table extends ExcelComponent {
  static className = 'excel__table'
  static currentResizeButton = null
  static currentResizeElement = {
    el: null,
    offset: null,
  }
  static tableCells = null;
  static resizeCells = null;
  static isMouseDown = false

  constructor($root) {
    super($root, {
      listeners: ['click', 'mousedown', 'mousemove', 'mouseup']
    })
  }

  toHTML() {
    return createTable();
  }
  onClick() {
  }
  onMousedown(e) {
    this.tableCells = Array.from(document.querySelectorAll('.cell'));
    this.isMouseDown = true
    const resizeType = e.target.dataset.resize;
    // resize table
    if (resizeType) {
      const $parent = $(e.target);
      this.currentResizeElement = {
        el: $parent.$el.dataset.resize === 'col'
            ? $parent.closest('.column')
            : $parent.closest('.row'),
        offset: $parent.$el.dataset.resize === 'col'
                ? $parent.closest('.column').$el.getBoundingClientRect().left
                : $parent.closest('.row').$el.getBoundingClientRect().top
      }
      this.currentResizeButton = e.target
      this.resizeBtnActiveClassSetter(resizeType);
      this.filerCellsByResizeType(resizeType, e.target)
      this.setResizeShadowPosition(e, resizeType, $parent)
      document.onmousemove = (event) => {
        this.onResizeMove(event, resizeType,
                          $parent.$el.dataset.resize === 'col' ?
                            $parent.closest('.column') :
                            $parent.closest('.row'));
      }
      // END resize table
    }
  }

  onMousemove() {}

  onMouseup(event) {
    // resize table
    const resizeType = this.currentResizeButton?.dataset.resize
    if (this.isMouseDown && this.currentResizeButton && resizeType) {
      this.currentResizeButton &&
      resizeType === 'col' &&
      this.resizeCells ?
        this.setCellsSize('width', 'x', event) :
        this.setCellsSize('height', 'y', event)
    }
    this.isMouseDown = false
    this.resizeBtnActiveClassSetter(resizeType);
    document.onmousemove = null;
    // END resize table
  }

  resizeBtnActiveClassSetter(type) {
    const resizeShadow = document.querySelector(`[data-resizetype='${type}']`)
    const resizeBtns = document.querySelectorAll(`.resize-btn`)
    if (this.currentResizeButton && !this.isMouseDown) {
      resizeShadow.classList.remove('resize-active');
      this.currentResizeButton = null
      resizeBtns.forEach(el => el.style.display = 'block')
    } else if (this.currentResizeButton) {
      resizeShadow.classList.add('resize-active')
      resizeBtns.forEach(el => el.style.display = 'none')
    }
  }

  setResizeShadowPosition(event, resizeType, resizeEl) {
    const resizeShadow =
      document.querySelector(`[data-resizetype='${resizeType}']`)
    const tableOffset =
     document.querySelector('.excel__table').getBoundingClientRect();
    const resizeElementOffset = resizeEl?.$el.getBoundingClientRect();
    if (event.clientX > resizeElementOffset.left && resizeType === 'col') {
      resizeShadow.style.left =
      `${event.clientX - (resizeShadow.clientWidth / 2) -
        tableOffset.left}px`
    } else if (event.clientY > resizeElementOffset.top &&
       resizeType === 'row') {
      resizeShadow.style.top =
       `${event.clientY - (resizeShadow.clientHeight / 2) - tableOffset.top}px`
    }
  }

  onResizeMove(event, resizeType, resizeEl) {
    if (this.isMouseDown && this.currentResizeButton) {
      this.setResizeShadowPosition(event, resizeType, resizeEl)
    }
  }

  setCellsSize(side, axis, event) {
    this.currentResizeElement.el.$el.style[side] =
         this.getResizeValue(axis, event)
    this.resizeCells.forEach(el => {
      el.style[side] = this.getResizeValue(axis, event)
    })
  }

  getResizeValue(axis, event) {
    const clientProp = `client${axis.toUpperCase()}`
    return `${event[clientProp] - this.currentResizeElement.offset}px`
  }

  filerCellsByResizeType(type, target) {
    this.resizeCells =
        this.tableCells.filter(el =>
            type === 'col'
                ? el.dataset.cellid.slice(0, 1) ===
                target.closest('.column').dataset.colid
                : el.dataset.cellid.slice(1) ===
                target.closest('.row').dataset.rowid
        )
  }
}
