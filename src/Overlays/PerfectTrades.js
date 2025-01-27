import { Overlay } from 'trading-vue-js'

export default {
  name: 'PerfectTrades',
  mixins: [Overlay],
  methods: {
    draw(ctx) {
      let layout = this.$props.layout // Layout object (see API BOOK)
      ctx.lineWidth = 1.5
      ctx.strokeStyle = 'black'
      for (var p of this.$props.data) {
        ctx.fillStyle = p[1] ? '#D61C4E' : '#3CCF4E'
        ctx.beginPath()
        let x = layout.t2screen(p[0]) // x - Mapping
        let y = layout.$2screen(p[2]) // y - Mapping
        ctx.arc(x, y, 5.5, 0, Math.PI * 2, true) // Trade point
        ctx.fill()
        ctx.stroke()

        if (p[3] && this.$props.settings.isShowText) {
          ctx.fillStyle = '#FEFBF6'
          ctx.font = '10px Arial'
          ctx.textAlign = 'center'
          ctx.fillText(`${p[4]} ${p[3]}k$`, x, y - 25)
        }
      }
    },
    use_for() { return ['PerfectTrades'] }
  }
}