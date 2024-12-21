import Handsontable from 'handsontable';
    import 'handsontable/dist/handsontable.full.css';
    import Plotly from 'plotly.js-dist';

    const data = [
      ['Group 1', 0.2, 0.3, 0.5],
      ['Group 2', 0.4, 0.4, 0.2],
      ['Group 3', 0.3, 0.2, 0.5]
    ];

    const container = document.getElementById('grid');
    const hot = new Handsontable(container, {
      data,
      colHeaders: ['Group', 'A', 'B', 'C'],
      rowHeaders: true,
      licenseKey: 'non-commercial-and-evaluation'
    });

    const plotContainer = document.getElementById('plot');
    const scaleSelect = document.getElementById('scaleSelect');

    function updatePlot() {
      const plotData = hot.getData().map(row => ({
        a: row[1],
        b: row[2],
        c: row[3]
      }));

      const tracePoints = {
        type: 'scatterternary',
        mode: 'markers',
        a: plotData.map(d => d.a),
        b: plotData.map(d => d.b),
        c: plotData.map(d => d.c),
        marker: {
          symbol: 100,
          color: '#FF6347',
          size: 14
        }
      };

      const traces = [tracePoints];

      if (plotData.length >= 3) {
        const tracePolygon = {
          type: 'scatterternary',
          mode: 'lines',
          a: [...plotData.map(d => d.a), plotData[0].a],
          b: [...plotData.map(d => d.b), plotData[0].b],
          c: [...plotData.map(d => d.c), plotData[0].c],
          line: {
            color: '#1f77b4',
            width: 2
          },
          fill: 'toself',
          fillcolor: 'rgba(31, 119, 180, 0.2)'
        };
        traces.push(tracePolygon);
      }

      const scale = scaleSelect.value === '1' ? 1 : 100;

      const layout = {
        ternary: {
          sum: scale,
          aaxis: { title: 'A', min: 0, max: scale },
          baxis: { title: 'B', min: 0, max: scale },
          caxis: { title: 'C', min: 0, max: scale }
        },
        showlegend: false,
        dragmode: 'zoom',
        margin: { t: 50, b: 50, l: 50, r: 50 }
      };

      Plotly.newPlot(plotContainer, traces, layout);
    }

    hot.addHook('afterChange', updatePlot);
    scaleSelect.addEventListener('change', updatePlot);
    updatePlot();
