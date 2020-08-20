<template>
  <BTabs small card>
    <BTab title="Graph" active><div class="g6-mindmap" ref="graph"></div></BTab>
    <BTab title="Source"><pre ref="source"><slot /></pre></BTab>
  </BTabs>
</template>

<script>
  import './dynamic-dependencies'
  import he from  'he'
  import jsonic from  'jsonic'
  import qs from 'qs'

  const mG6 = import('@antv/g6')
  const mHierarchy = import('@antv/hierarchy')

 function COLLAPSE_ICON (x, y, r) {
    return [
      [ 'M', x, y ],
      [ 'a', r, r, 0, 1, 0, r * 2, 0],
      [ 'a', r, r, 0, 1, 0, -r * 2, 0],
      [ 'M', x + 2, y ],
      [ 'L', x + 2 * r - 2, y]
    ]
  }
 function EXPAND_ICON (x, y, r) {
    return [
      [ 'M', x, y ],
      [ 'a', r, r, 0, 1, 0, r * 2, 0],
      [ 'a', r, r, 0, 1, 0, -r * 2, 0],
      [ 'M', x + 2, y ],
      [ 'L', x + 2 * r - 2, y],
      [ 'M', x + r, y - r + 2 ],
      [ 'L', x + r, y + r - 2 ]
    ]
  }

  export default {
    props: {
      metaTitle: {
        type: String,
        default: ''
      },
      metaOpts: {
        type: String,
        default: ''
      }
    },
    mounted () {
      Promise.all([ mG6, mHierarchy ]).then(modules => {
        const [ { default: G6 }, { default: Hierarchy } ] = modules
        let n = 0
        const options = qs.parse(this.metaOpts)
        G6.registerNode('tree-node', {
          drawShape(cfg, group) {
            const rect = group.addShape('rect', {
              attrs: { fill: '#fff', stroke: '#666' }
            })
            const content = (cfg.text && cfg.text.replace(/(.{19})/g, '$1\n')) || ''
            const text = group.addShape('text', {
              attrs: {
                text: content,
                x: 0,
                y: 0,
                textAlign: 'left',
                textBaseline: 'middle',
                fill: '#666'
              }
            })
            const bbox = text.getBBox()
            const hasChildren = cfg.children && cfg.children.length
            if (hasChildren) {
              group.addShape('marker', {
                attrs: {
                  x: bbox.maxX + 6,
                  y: bbox.minX + bbox.height / 2 - 6,
                  r: 6,
                  symbol: cfg.collapsed ? EXPAND_ICON : COLLAPSE_ICON,
                  stroke: '#666',
                  lineWidth: 2
                },
                className: 'collapse-icon'
              })
            }
            rect.attr({
              x: bbox.minX - 4,
              y: bbox.minY - 6,
              width: bbox.width + (hasChildren ? 26 : 8),
              height: bbox.height + 12})
            return rect
          }
        }, 'single-shape')
        const graph = new G6.TreeGraph({
          container: this.$refs.graph,
          width: this.$el.offsetWidth,
          height: parseInt(options.height) || 300,
          plugins: [ ],
          modes: {
            default: [],
            explorer: [{
              type: 'collapse-expand',
              onChange(item, collapsed) {
                const data = item.getModel()
                const icon = item.get('group').findByClassName('collapse-icon')
                if (collapsed) {
                  icon.attr('symbol', EXPAND_ICON)
                } else {
                  icon.attr('symbol', COLLAPSE_ICON)
                }
                data.collapsed = collapsed
                return true
              }
            }, 'drag-canvas', 'zoom-canvas']
          },
          defaultNode: {
            shape: 'tree-node',
            anchorPoints: [ [0, 0.5], [1, 0.5] ],
          },
          defaultEdge: {
            shape: 'cubic-horizontal'
          },
          edgeStyle: {
            default: {
              stroke: '#A3B1BF'
            }
          },
          layout: data => {
            return Hierarchy.compactBox(data, {
              direction: options.direction || 'H',
              getId(d) { if (!d.id) {d.id = `${this._uid}_${n++}`} return d.id },
              getHeight() { return 16 },
              getWidth() { return 16 },
              getVGap() { return 20 },
              getHGap() { return 80 }
            })
          }
        })
        let mode = 'default'
        graph.on('dblclick', () => {
          if (mode == 'explorer') {
            mode = 'default'
          } else {
            mode = 'explorer'
          }
          graph.setMode(mode)
        })
        try {
          graph.data(jsonic(he.decode(this.$refs.source.innerHTML)))
          graph.render()
          graph.fitView()
        } catch (e) {
          console.log('Draw mindmap error:', e)
        }
      })
    }
  }
</script>

<style>

</style>
