/* global d3, crossfilter, dc */
var select1 = dc.cboxMenu('#select1')
    select2 = dc.selectMenu('#select2')
    basisOfRecordChart = dc.pieChart('#basisOfRecord')
    kingdomChart = dc.barChart('#kingdom')
    phylumChart = dc.rowChart('#phylum-chart')
    classChart = dc.rowChart('#class-chart')
    orderChart = dc.rowChart('#order-chart')
    familyChart = dc.rowChart('#family-chart')
    genusChart = dc.rowChart('#genus-chart')
    speciesChart = dc.rowChart('#species-chart')
    phylumSearch = dc.textFilterWidget('#phylum-search')
    classSearch = dc.textFilterWidget('#class-search')
    orderSearch = dc.textFilterWidget('#order-search')
    familySearch = dc.textFilterWidget('#family-search')  
    genusSearch = dc.textFilterWidget('#genus-search')
    speciesSearch = dc.textFilterWidget('#species-search')
    phylumAxis = dc.axisChart('#phylum-axis')
    classAxis = dc.axisChart('#class-axis')
    orderAxis = dc.axisChart('#order-axis')
    familyAxis = dc.axisChart('#family-axis')
    genusAxis = dc.axisChart('#genus-axis')
    speciesAxis = dc.axisChart('#species-axis');
    // phylumSelect = dc.selectMenu('#phylum-select');

d3.csv('humboldt_sample.csv').then(data => {

  const cs = crossfilter(data);
  const all = cs.groupAll();

  function remove_empty_bins(source_group){
    return{
      all:function(){
        return source_group.all().filter(function(d){
          return d.value != 0;
        });
      }
    };
  };
  
  const colombianDim = cs.dimension(d => d['publishingCountry'])
        organizationDim = cs.dimension(d => d['organization'])
        basisOfRecordDim = cs.dimension(d => d['basisOfRecord'])
        kingdomDim = cs.dimension(d => d['kingdom'])
        phylumDim = cs.dimension(d => d['phylum'])
        classDim = cs.dimension(d => d['class'])
        orderDim = cs.dimension(d => d['order'])
        familyDim = cs.dimension(d => d['family'])
        genusDim = cs.dimension(d => d['genus'])
        speciesDim = cs.dimension(d => d['species'])

        phylumDimSearch = cs.dimension(d => d['phylum'])
        classDimSearch = cs.dimension(d => d['class'])
        orderDimSearch = cs.dimension(d => d['order'])
        familyDimSearch = cs.dimension(d => d['family'])
        genusDimSearch = cs.dimension(d => d['genus'])
        speciesDimSearch = cs.dimension(d => d['species'])

        nonEmptyBasisOfRecord = remove_empty_bins(basisOfRecordDim.group())
        nonEmptyKingdom = remove_empty_bins(kingdomDim.group())
        nonEmptyPhylum = remove_empty_bins(phylumDim.group())
        nonEmptyClass = remove_empty_bins(classDim.group())
        nonEmptyOrder = remove_empty_bins(orderDim.group())
        nonEmptyFamily = remove_empty_bins(familyDim.group())
        nonEmptyGenus = remove_empty_bins(genusDim.group())
        nonEmptySpecies = remove_empty_bins(speciesDim.group());

  select1
    .dimension(colombianDim)
    .group(colombianDim.group())
    .controlsUseVisibility(true);
  
  select2
    .dimension(organizationDim)
    .group(organizationDim.group())
    .multiple(true)
    .numberVisible(5)
    .controlsUseVisibility(true);
  
  function dominio(group){
    var list = []
        iterable = group.all();
    for (var i = 0; i < iterable.length; i++) 
      {list.push(iterable[i].key)}
    return(list);
  }

  basisOfRecordChart
    //.width(600)
    .height(400)
    .innerRadius(50)
    .externalLabels(45)
    .externalRadiusPadding(50)
    //.drawPaths(true)
    .dimension(basisOfRecordDim)
    .group(nonEmptyBasisOfRecord)
    .colors(d3.scaleOrdinal().domain(["Aparición",
      "Desconocido", "Espécimen Preservado",
      "Espécimen Vivo", "Fósil", "Muestra de Tejido",
      "Observación Humana", "Observación por Máquina"])
      .range(['#a6761d', '#d95f02', '#7570b3', '#e7298a', 
              '#66a61e', '#e6ab02', '#1b9e77', '#666666']))
    //.turnOnControls(true)
    .legend(dc.htmlLegend().container('#basisOfRecord-legend').horizontal(true).highlightSelected(true));

  kingdomChart
    .margins({ left: 50, top: 0, right: 10, bottom: 20 })
    .height(400)
    .width(700)
    .x(d3.scaleBand())
    .y(d3.scaleSqrt().domain([0, 75000]).clamp(true))
    .xUnits(dc.units.ordinal)
    .elasticY(true)
    .brushOn(false)
    .dimension(kingdomDim)
    .barPadding(0.1)
    .ordinalColors(['#a65628'])
    .outerPadding(0.05)
    .group(nonEmptyKingdom);
    // .fixedBarHeight(20)
    // .height(nonEmptyKingdom.all().length * 20 + 1)
    // .margins({top: 0, right: 20, bottom: 0, left: 20})
    // .width(600)
    // .xAxis(d3.axisTop())
    // .elasticX(true)
    // .ordinalColors(['#e41a1c'])
    // .gap(1)
    // .dimension(kingdomDim)
    // .group(nonEmptyKingdom)
    // .on('pretransition', function () {
    //   kingdomChart.select('g.axis').attr('transform', 'translate(0,0)');
    //   kingdomChart.selectAll('line.grid-line').attr('y2', kingdomChart.effectiveHeight());
    // });  

  phylumChart
    .fixedBarHeight(20)
    .height(nonEmptyPhylum.all().length * 21)
    .width(700)
    .margins({top: 0, right: 20, bottom: 0, left: 20})
    .xAxis(d3.axisTop())
    .elasticX(true)
    .ordinalColors(['#e41a1c'])
    .gap(1)
    .dimension(phylumDim)
    .group(nonEmptyPhylum)
    .on('pretransition', function () {
      phylumChart.select('g.axis').attr('transform', 'translate(0,0)');
      phylumChart.selectAll('line.grid-line').attr('y2', phylumChart.effectiveHeight());
    })
    .on('postRender', function() {
      phylumChart.root().node().appendChild(phylumChart.select('div.info').node())
    });
    
    dc.override(phylumChart, 'redraw', function() {
      phylumChart.height(nonEmptyPhylum.all().length * 21);
      return phylumChart._redraw();
    });
  
  phylumAxis
    .margins({ left: 20, top: 20, right: 20, bottom: 0 })
    .height(21)
    .width(700)
    .dimension(phylumDim)
    .group(phylumDim.group())
    .elastic(true)
    .type('axisTop');

  classChart
    .fixedBarHeight(20)
    .height(nonEmptyClass.all().length * 20 + 1)
    .margins({top: 0, right: 20, bottom: 0, left: 20})
    .width(700)
    .xAxis(d3.axisTop())
    .elasticX(true)
    .ordinalColors(['#337eb8'])
    .gap(1)
    .dimension(classDim)
    .group(nonEmptyClass)
    .on('pretransition', function () {
      classChart.select('g.axis').attr('transform', 'translate(0,0)');
      classChart.selectAll('line.grid-line').attr('y2', classChart.effectiveHeight());
    })
    .on('postRender', function() {
      classChart.root().node().appendChild(classChart.select('div.info').node())
    });
    
    dc.override(classChart, 'redraw', function() {
      classChart.height(nonEmptyClass.all().length * 21);
      return classChart._redraw();
    });
  
  classAxis
    .margins({ left: 20, top: 20, right: 20, bottom: 0 })
    .height(21)
    .width(700)
    .dimension(classDim)
    .group(classDim.group())
    .elastic(true)
    .type('axisTop');

  orderChart
    .fixedBarHeight(20)
    .height(nonEmptyOrder.all().length * 20 + 1)
    .margins({top: 0, right: 20, bottom: 0, left: 20})
    .width(700)
    .xAxis(d3.axisTop())
    .elasticX(true)
    .ordinalColors(['#4daf4a'])
    .gap(1)
    .dimension(orderDim)
    .group(nonEmptyOrder)
    .on('pretransition', function () {
      orderChart.select('g.axis').attr('transform', 'translate(0,0)');
      orderChart.selectAll('line.grid-line').attr('y2', orderChart.effectiveHeight());
    })
    .on('postRender', function() {
      orderChart.root().node().appendChild(orderChart.select('div.info').node())
    });
    
    dc.override(orderChart, 'redraw', function() {
      orderChart.height(nonEmptyOrder.all().length * 21);
      return orderChart._redraw();
    });
  
  orderAxis
    .margins({ left: 20, top: 20, right: 20, bottom: 0 })
    .height(21)
    .width(700)
    .dimension(orderDim)
    .group(orderDim.group())
    .elastic(true)
    .type('axisTop');

  familyChart
    .fixedBarHeight(20)
    .height(nonEmptyFamily.all().length * 20 + 1)
    .margins({top: 0, right: 20, bottom: 0, left: 20})
    .width(700)
    .xAxis(d3.axisTop())
    .elasticX(true)
    .ordinalColors(['#984ea3'])
    .gap(1)
    .dimension(familyDim)
    .group(nonEmptyFamily)
    .on('pretransition', function () {
      familyChart.select('g.axis').attr('transform', 'translate(0,0)');
      familyChart.selectAll('line.grid-line').attr('y2', familyChart.effectiveHeight());
    })
    .on('postRender', function() {
      familyChart.root().node().appendChild(familyChart.select('div.info').node())
    });
    
    dc.override(familyChart, 'redraw', function() {
      familyChart.height(nonEmptyFamily.all().length * 21);
      return familyChart._redraw();
    });
  
  familyAxis
    .margins({ left: 20, top: 20, right: 20, bottom: 0 })
    .height(21)
    .width(700)
    .dimension(familyDim)
    .group(familyDim.group())
    .elastic(true)
    .type('axisTop');

  genusChart
    .fixedBarHeight(20)
    .height(nonEmptyGenus.all().length * 20 + 1)
    .margins({top: 0, right: 20, bottom: 0, left: 20})
    .width(700)
    .xAxis(d3.axisTop())
    .elasticX(true)
    .ordinalColors(['#ff7f00'])
    .gap(1)
    .dimension(genusDim)
    .group(nonEmptyGenus)
    .on('pretransition', function () {
      genusChart.select('g.axis').attr('transform', 'translate(0,0)');
      genusChart.selectAll('line.grid-line').attr('y2', genusChart.effectiveHeight());
    })
    .on('postRender', function() {
      genusChart.root().node().appendChild(genusChart.select('div.info').node())
    });
    
    dc.override(genusChart, 'redraw', function() {
      genusChart.height(nonEmptyGenus.all().length * 21);
      return genusChart._redraw();
    });
  
  genusAxis
    .margins({ left: 20, top: 20, right: 20, bottom: 0 })
    .height(21)
    .width(700)
    .dimension(genusDim)
    .group(genusDim.group())
    .elastic(true)
    .type('axisTop');

  speciesChart
    .fixedBarHeight(20)
    .height(nonEmptySpecies.all().length * 20 + 1)
    .margins({top: 0, right: 20, bottom: 0, left: 20})
    .width(700)
    .xAxis(d3.axisTop())
    .elasticX(true)
    .ordinalColors(['#fcd12a'])
    .gap(1)
    .dimension(speciesDim)
    .group(nonEmptySpecies)
    .on('pretransition', function () {
      speciesChart.select('g.axis').attr('transform', 'translate(0,0)');
      speciesChart.selectAll('line.grid-line').attr('y2', speciesChart.effectiveHeight());
    })
    .on('postRender', function() {
      speciesChart.root().node().appendChild(speciesChart.select('div.info').node())
    });
    
    dc.override(speciesChart, 'redraw', function() {
      speciesChart.height(nonEmptySpecies.all().length * 21);
      return speciesChart._redraw();
    });
  
  speciesAxis
    .margins({ left: 20, top: 20, right: 20, bottom: 0 })
    .height(21)
    .width(700)
    .dimension(speciesDim)
    .group(speciesDim.group())
    .elastic(true)
    .type('axisTop');

  phylumSearch
    .dimension(phylumDimSearch);

  classSearch
    .dimension(classDimSearch);

  orderSearch
    .dimension(orderDimSearch);

  familySearch
    .dimension(familyDimSearch);
    
  genusSearch
    .dimension(genusDimSearch);

  speciesSearch
    .dimension(speciesDimSearch);

  // phylumSelect
  //   .dimension(phylumDimSearch)
  //   .group(phylumDimSearch.group())
  //   .multiple(true)
  //   .numberVisible(1)
  //   .controlsUseVisibility(true);

  dc.renderAll();
});
