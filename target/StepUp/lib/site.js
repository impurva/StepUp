window.baseURL = '/stepup/api/controller';

function Dance() {
	
this.bindEvents = function() {
		
		$('#txtDanceSearch').autocomplete({
			minLength: 2,
		    delay: 100,
			select: function( event, ui ) {
				//$('#txtDanceSearch').data('dancename', ui.item.name);
				$('#txtDanceSearch').data('danceid',ui.item.id);
				$('#txtDanceSearch').data('dancetype',ui.item.type);
				$('#txtDanceSearch').data('dancename',ui.item.name);
				$('#txtDanceSearch').val(ui.item.name);
				return false;
			},
			
		    source: function (request, response) {
		    	$.ajax( {
		    		url: window.baseURL + '/searchAll?term='+request.term,
		    		type:"GET",
		    		success: function(data) {
		    			response(data);
		    		}
		    	});
		    }
		}).data("ui-autocomplete")._renderItem = function( ul, item ) {
			return $( "<li></li>" )
			.data( "item.autocomplete", item )
			.append( "<a href='#'>" + item.label + "</a>" )
			.appendTo( ul );
		};
		
		$('#txtDanceSearch2').autocomplete({
			minLength: 2,
		    delay: 100,
			select: function( event, ui ) {
				//$('#txtDanceSearch2').data('dancename', ui.item.name);
				$('#txtDanceSearch2').data('danceid',ui.item.id);
				$('#txtDanceSearch2').data('dancetype',ui.item.type);
				$('#txtDanceSearch2').data('dancename',ui.item.name);
				$('#txtDanceSearch2').val(ui.item.name);
				return false;
			},
			
		    source: function (request, response) {
		    	$.ajax( {
		    		url: window.baseURL + '/searchAll?term='+request.term,
		    		type:"GET",
		    		success: function(data) {
		    			response(data);
		    		}
		    	});
		    }
		}).data("ui-autocomplete")._renderItem = function( ul, item ) {
			return $( "<li></li>" )
			.data( "item.autocomplete", item )
			.append( "<a href='#'>" + item.label + "</a>" )
			.appendTo( ul );
		};
	
		
		
		$('.dance_action').bind('click',function(event){
			var a = $(this).data('action');
			switch(a) {
				case 'Moves':
					window.pageObj.findAllMoves($('#txtDanceSearch').val());
					break;
				case 'ClosestDance':
					window.pageObj.findClosesDance($('#txtDanceSearch').val());
					break;
				case 'Centrality':	
					window.pageObj.findCentrality($('#txtDanceSearch').val(), $('#txtDanceSearch').data('dancetype'),  $('#txtDanceSearch2').val(), $('#txtDanceSearch2').data('dancetype'));
					break;
				case 'Classfication' :
					Break;
				case '' :
					alert('In Progress');
					break;
			};
		});
		
	};
	
	this.findAllMoves = function(term) {
		$.ajax( {
    		url: window.baseURL + '/findAllMoves',
    		data : {'term' : term },
    		dataType : 'json',
    		type:"POST",
    		success: function(data) {
    			$('#dance_data').hide();
    			$('#videoList').hide();
    			window.pageObj.renderFindAllMoves(data);    			
     		}
    	});
	};
	
	this.renderFindAllMoves = function(data) {
		
		sys = arbor.ParticleSystem();
		sys.parameters({stiffness:900, repulsion:3000, gravity:true, dt:0.015});
	    sys.renderer = Renderer($("#viewport"));
	    sys.addNode('dance', {'color':'#FFCC00', 'shape' : 'dot', 'label' : data['danceName'], 'type' : 'Dance'} );
	    
	    for(var i in data['moves']) {
//	    	sys.addNode('parent'+ i, {'color':'blue', 'shape' : 'rect', 'label' : i});
	    	
	    	var children = data['moves'][i];
	    	for(var j in children) {
	    		sys.addNode('move'+ j, {'color':'green', 'shape' : 'rect', 'label' : children[j], 'type' : 'Move'});
	    		sys.addEdge('dance','move'+ j, {length : 0.5, label : 'hasMove', name : 'hasMove', directed : true, pointSize:3});
//	    		sys.addEdge('parent'+ i,'move'+ j, {'length' : 0.7, 'label' : 'hasParent', 'name' : 'parent'});
	    	}
	    }
	};
	
	this.nodeClicked = function(selected) {
		console.log(selected);
		var nodeType = selected.node.data.type;
		switch(nodeType) {
		
			case 'Dance':
				this.getDanceDetails(selected.node.data.label);
				break;
				
			case 'Move':
				this.getAllVideos(selected.node.data.label + ' in ' +sys.getNode('dance').data.label);
				break;
		}
	};
	
	
	this.loadedVideos = {};
	

	
	this.findCentrality = function(term1, nodeType1, term2, nodeType2){
		if(nodeType1=="dance")
			{	
				this.findCentrality_Dance(term1,term2);
			}
		
		if(nodeType1=="mm")
		{	
			this.findCentralityParentMoves(term1,term2);
		}
		
		if(nodeType1=="artist"){
			this.findCentrality_artist(term1,term2);
			
		}
	};
	
	
	
	this.findCentrality_Dance = function(term1,term2) {
		$.ajax({
    		url: window.baseURL + '/findCentralityDances',
    		data : {'term1' : term1,'term2':term2 },
    		dataType : 'json',
    		type:"POST",
    		success: function(data) {
    			$('#dance_data').hide();
    			$('#videoList').hide();
    			window.pageObj.renderFindCentality_Dance(data);    			
     		}
    	});
	};
	
	this.findCentrality_artist = function(term1,term2) {
		$.ajax({
    		url: window.baseURL + '/findCentralityArtists',
    		data : {'term1' : term1,'term2':term2 },
    		dataType : 'json',
    		type:"POST",
    		success: function(data) {
    			$('#dance_data').hide();
    			$('#videoList').hide();
    			window.pageObj.renderFindCentality_Dance(data);    			
     		}
    	});
	};
	
	this.findCentralityParentMoves = function(term1,term2) {
		$.ajax({
    		url: window.baseURL + '/findCentralityParentMoves',
    		data : {'term1' : term1,'term2':term2 },
    		dataType : 'json',
    		type:"POST",
    		success: function(data) {
    			$('#dance_data').hide();
    			$('#videoList').hide();
    			window.pageObj.renderFindCentality_Dance(data);    			
     		}
    	});
	};
	
	this.findCentrality_Moves = function(term1,term2) {
		$.ajax({
    		url: window.baseURL + '/findCentralityDances',
    		data : {'term1' : term1,'term2':term2 },
    		dataType : 'json',
    		type:"POST",
    		success: function(data) {
    			$('#dance_data').hide();
    			$('#videoList').hide();
    			window.pageObj.renderFindCentality_Dance(data);    			
     		}
    	});
	};
	
	
	
	this.renderFindCentality_Dance= function(data){
		sys = arbor.ParticleSystem();
		sys.parameters({stiffness:900, repulsion:1000, gravity:true, dt:0.015});
	    sys.renderer = Renderer($("#viewport").css({"width":"1000px","height":"600px"}));
	    sys.addNode(data['start'], {'color':'#FFCC00', 'shape' : 'dot', 'label' : data['start'], 'type' : 'Dance'} );
	    sys.addNode(data['end'], {'color':'#FFCC00', 'shape' : 'dot', 'label' : data['end'], 'type' : 'Dance'} );
	    
	    if(data['moves'])
	    {
	    	for(var i in data['moves']) {
	    		var child = data['moves'][i];
	    		sys.addNode(child['value'], {'color':'green', 'shape' : 'rect', 'label' : child['value'],'type' : 'Move'});
	    		sys.addEdge(data['start'],child['value'], {length : 0.7, label : 'hasMove', name : 'hasMove', directed : true});
	    		sys.addEdge(data['end'],child['value'], {length : 0.7, label : 'hasMove', name : 'hasMove', directed : true});
	    	}	
	    }
	    
	    if(data['categories'])
	    {
	    	for(var j in data['categories']) {
	    		var child = data['categories'][j];
	    		sys.addNode(child['value'], {'color':'#FF6699', 'shape' : 'dot', 'label' : child['value'],'type' : 'cat'});
	    		sys.addEdge(data['start'],child['value'], {length : 0.7, label : 'hasCategory', name : 'hasCategory', directed : true});
	    		sys.addEdge(data['end'],child['value'], {length : 0.7, label : 'hasCategory', name : 'hasCategory', directed : true});
	    	}	
	    }
	    
	    if(data['artists'])
	    {
	    	for(var k in data['artists']) {
	    		var child = data['artists'][k];
	    		sys.addNode(child['value'], {'color':'#00FF00', 'shape' : 'dot', 'label' : child['value'],'type' : 'artist'});
	    		sys.addEdge(data['start'],child['value'], {length : 0.7, label : 'hasArtist', name : 'hasArtist', directed : true});
	    		sys.addEdge(data['end'],child['value'], {length : 0.7, label : 'hasArtist', name : 'hasArtist', directed : true});
	
	    	}	
	    }
	    
	    if(data['mms'])
	    {
	    	for(var m in data['artists']) {
	    		var child = data['artists'][m];
	    		sys.addNode(child['value'], {'color':'#FF0000', 'shape' : 'rect', 'label' : child['value'],'type' : 'mmove'});
	    		sys.addEdge(data['start'],child['value'], {length : 0.7, label : 'hasMasterMove', name : 'hasMasterMove', directed : true});
	    		sys.addEdge(data['end'],child['value'], {length : 0.7, label : 'hasMasterMove', name : 'hasMasterMove', directed : true});
	
	    	}	
	    }
	    
	    if(data['beats'])
	    {
	    	for(var m in data['beats']) {
	    		var child = data['beats'][m];
	    		sys.addNode(child['value'], {'color':'#66FF33', 'shape' : 'rect', 'label' : child['value'],'type' : 'beat'});
	    		sys.addEdge(data['start'],child['value'], {length : 0.7, label : 'hasBeat', name : 'hasBeat', directed : true});
	    		sys.addEdge(data['end'],child['value'], {length : 0.7, label : 'hasBeat', name : 'hasBeat', directed : true});
	
	    	}	
	    }
	    
	    if(data['origins'])
	    {
	    	for(var m in data['origins']) {
	    		var child = data['origins'][m];
	    		sys.addNode(child['value'], {'color':'gray', 'shape' : 'dot', 'label' : child['value'],'type' : 'origin'});
	    		sys.addEdge(data['start'],child['value'], {length : 0.7, label : 'hasBeat', name : 'hasOrigin', directed : true});
	    		sys.addEdge(data['end'],child['value'], {length : 0.7, label : 'hasBeat', name : 'hasOrigin', directed : true});
	
	    	}	
	    	
	    	 
		    if(data['dances'])
		    {
		    	for(var m in data['dances']) {
		    		var child = data['dances'][m];
		    		sys.addNode(child['value'], {'color':'gray', 'shape' : 'dot', 'label' : child['value'],'type' : 'Dance'});
		    		sys.addEdge(data['start'],child['value'], {length : 0.7, label : 'hasDance', name : 'hasDance', directed : true});
		    		sys.addEdge(data['end'],child['value'], {length : 0.7, label : 'hasDance', name : 'hasDance', directed : true});
		
		    	}	
		    }
	    }
	    
	    	
	};
	
	this.getDanceDetails = function(term) {
		 //$('#dance_data').html('');
		   $.ajax({
		       url : window.baseURL + '/searchDance', 
		       type : 'POST',
		       data : {'term' : term},
		       datetype : 'json',
		       success : function(data) { 
		    	   if(data) {
		    		 $('#videoList').hide();
		  	         $('#dance_name1').html(data[0].name);
		  	         $('#dance_desc1').html(data[0].desc);
		  	         $('#dance_link1').attr('href',data[0].link);
		  	         $('#dance_link1').text(data[0].link);
		  	         $('#dance_image1').attr("src",data[0].thumbnail);
		  	         $('#dance_data').slideDown(1000);
		    	   }
		       }
		   });  
		   $('#dance_data').slideDown(1000);
	};     
	
	this.getAllVideos = function(term) {
	 $('#video_playlist').html('');
	   $.ajax({
	       url : window.baseURL + '/findMoveVideos', 
	       type : 'POST',
	       data : {'term' : term},
	       datetype : 'json',
	       success : function(data) { 
	       if(data['items']) {
	         var items = data['items'];
	         var content = '';

	         for(var i in items)  {
	           if(!window.pageObj.loadedVideos[items[i]['id']['videoId']]) {
	             content += "<div class='media'><a class='pull-left' href='#'> \
	             <img src='"+items[i]['snippet']['thumbnails']['default']['url']+"' rel='"+items[i]['id']['videoId']+"' alt='"+items[i]['snippet']['title']+"' class='img-thumbnail' /> \
	             </a> <div class='media-body'> <h4 class='media-heading'><a class='youtube' rel='"+items[i]['id']['videoId']+"' href='javascript:void(0)'>"+items[i]['snippet']['title']+"</a></h4> "+items[i]['snippet']['description']+"</div></div>";
	             window.pageObj.loadedVideos[items[i]['id']['videoId']] = items[i]['snippet']['title'];
	           }
	         };

	         $('#video_playlist').append(content);
	       }
	       $('#dance_data').hide();
	       $('#videoList').slideDown(1000);
	     }
	   });
	   $('body').delegate('a.youtube', 'click',function(evt){
	     $('#youtube_video').html('<iframe id="ytplayer" type="text/html" width="425px" height="349" src="http://www.youtube.com/embed/'+$(this).attr('rel')+'?autoplay=1&origin=http://example.com" frameborder="0"/>'); 
	     $("html, body").animate({ scrollTop: 0 }, "slow");          
	   // $('#ytplayer').attr('src', "http://www.youtube.com/embed/"+$(this).attr('rel')+"?autoplay=1&origin=http://example.com");
	   });

	   $('body').delegate('img.img-thumbnail', 'click',function(evt){
	     $('#youtube_video').html('<iframe id="ytplayer" type="text/html" width="425px" height="349" src="http://www.youtube.com/embed/'+$(this).attr('rel')+'?autoplay=1&origin=http://example.com" frameborder="0"/>'); 
	     $("html, body").animate({ scrollTop: 0 }, "slow");          
	   // $('#ytplayer').attr('src', "http://www.youtube.com/embed/"+$(this).attr('rel')+"?autoplay=1&origin=http://example.com");
	   });

	   $('#youtube_video').html('');
	   $('#youtube_video').slideDown(1000);
	};

	
	this.findClosesDance = function(term) {
		$.ajax({
			url : window.baseURL + '/closestdance', 
			type : 'POST',
			data : {'term' : term},
			datetype : 'json',
			success : function(data) { 
				$('#dance_data').hide();
    			$('#videoList').hide();
				window.pageObj.renderCloset(data);
			}
		});
	};
	
	this.renderCloset = function(data) {
		
		var labels = [];
		var values = [];
		for(var i in data) {
			labels.push(data[i]['key']);
			values.push(data[i]['value']);
		}
		dataset = [ {
			fillColor : "rgba(26,166,189,0.85)",
			strokeColor : "rgba(26,166,189,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#00000",
			data : values
		}];
		$("#viewport").html('');
		var ctx2 = document.getElementById("viewport").getContext("2d");
		var g2 = new Chart(ctx2).Radar({'labels' : labels, 'datasets':dataset},
				{scaleLineColor : "rgba(0,0,0,0.4)",angleLineColor : "rgba(0,0,0,.4)", scaleShowLabels : true,
			pointLabelFontStyle : "bold"});
	};


}



$(document).ready(function(){
	
	window.pageObj = new Dance();
	pageObj.bindEvents();
	
});
