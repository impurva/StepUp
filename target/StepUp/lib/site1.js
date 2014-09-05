window.baseURL = '/stepup/api/controller';

function Dance() {
	
	this.bindEvents = function() {
		
		$('#txtDanceSearch').autocomplete({
			minLength: 2,
		    delay: 100,
			select: function( event, ui ) {
				$('#txtDanceSearch').data('dancename', ui.item.name);
				$('#txtDanceSearch').data('danceid',ui.item.id);
				$('#txtDanceSearch').val(ui.item.name);
				window.pageObj.findAllMoves(ui.item.name);
				return false;
			},
			
		    source: function (request, response) {
		    	$.ajax( {
		    		url: window.baseURL + '/searchDance?term='+request.term,
		    		type:"GET",
		    		success: function(data) {
		    			response(data);
		    		}
		    	});
		    }
		}).data("ui-autocomplete")._renderItem = function( ul, item ) {
			return $( "<li></li>" )
			.data( "item.autocomplete", item )
			.append( "<a href='#'>" + item.name + "</a>" )
			.appendTo( ul );
		};
		
	};
	
	this.findAllMoves = function(term) {
		$.ajax( {
    		url: window.baseURL + '/findAllMoves',
    		data : {'term' : term },
    		dataType : 'json',
    		type:"POST",
    		success: function(data) {
    			window.pageObj.renderFindAllMoves(data);    			
     		}
    	});
	};
	
	this.renderFindAllMoves = function(data) {
		
		sys = arbor.ParticleSystem();
		sys.parameters({stiffness:900, repulsion:3000, gravity:true, dt:0.015});
	    sys.renderer = Renderer($("#viewport"));
	    sys.addNode('dance', {'color':'red', 'shape' : 'dot', 'label' : data['danceName'], 'type' : 'Dance'} );
	    
	    for(var i in data['moves']) {
//	    	sys.addNode('parent'+ i, {'color':'blue', 'shape' : 'rect', 'label' : i});
	    	
	    	var children = data['moves'][i];
	    	for(var j in children) {
	    		sys.addNode('move'+ j, {'color':'blue', 'shape' : 'rect', 'label' : children[j], 'type' : 'Move'});
	    		sys.addEdge('dance','move'+ j, {length : 0.7, label : 'hasMove', name : 'hasMove', directed : true});
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
	
	this.getDanceDetails = function(term) {
		 //$('#dance_data').html('');
		   $.ajax({
		       url : window.baseURL + '/searchDance', 
		       type : 'POST',
		       data : {'term' : term},
		       datetype : 'json',
		       success : function(data) { 
		    	   if(data) {
		    		 $('#dance_data').show();
		  	         $('#dance_name1').html(data[0].name);
		  	         $('#dance_desc1').html(data[0].desc);
		  	         $('#dance_link1').attr('href',data[0].link);
		  	         $('#dance_link1').text(data[0].link);
		  	         $('#dance_image1').attr("src",data[0].thumbnail);
		  	         
		    	   }
		       }
		   });  
		   //$('#dance_data').animate({ scrollTop: 0 }, "slow");  
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
	     }
	   });
	   $('body').delegate('a.youtube', 'click',function(evt){
	     $('#youtube_video').html('<iframe id="ytplayer" type="text/html" width="323" height="340" src="http://www.youtube.com/embed/'+$(this).attr('rel')+'?autoplay=1&origin=http://example.com" frameborder="0"/>'); 
	     $("html, body").animate({ scrollTop: 0 }, "slow");          
	   // $('#ytplayer').attr('src', "http://www.youtube.com/embed/"+$(this).attr('rel')+"?autoplay=1&origin=http://example.com");
	   });

	   $('body').delegate('img.img-thumbnail', 'click',function(evt){
	     $('#youtube_video').html('<iframe id="ytplayer" type="text/html" width="323" height="340" src="http://www.youtube.com/embed/'+$(this).attr('rel')+'?autoplay=1&origin=http://example.com" frameborder="0"/>'); 
	     $("html, body").animate({ scrollTop: 0 }, "slow");          
	   // $('#ytplayer').attr('src', "http://www.youtube.com/embed/"+$(this).attr('rel')+"?autoplay=1&origin=http://example.com");
	   });

	   $('#youtube_video').html('');
	   $('#youtube_video').slideDown(1000);
	};



}



$(document).ready(function(){
	
	window.pageObj = new Dance();
	pageObj.bindEvents();
	$('#dance_data').hide();
	
});