import './scss/index.scss'
import {Excel} from '@/components/excel/Excel'
import {Header} from '@/components/header/Header'
import {Tollbar} from '@/components/toolbar/Tollbar'
import {Formula} from '@/components/formula/Formula'
import {Table} from '@/components/table/Table'

const excel = new Excel('#app', {
  components: [Header, Tollbar, Formula, Table],
})
excel.render()
