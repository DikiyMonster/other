var ddsmoothmenu={


arrowimages: {down:['downarrowclass', 'down.gif', 23], right:['rightarrowclass', 'right.gif']},
transition: {overtime:300, outtime:300}, 
shadow: {enable:true, offsetx:5, offsety:5}, 
showhidedelay: {showdelay: 100, hidedelay: 200}, 



detectwebkit: navigator.userAgent.toLowerCase().indexOf("applewebkit")!=-1, 
detectie6: document.all && !window.XMLHttpRequest,

getajaxmenu:function($, setting){ 
	var $menucontainer=$('#'+setting.contentsource[0]) 
	$menucontainer.html("Loading Menu...")
	$.ajax({
		url: setting.contentsource[1], 
		async: true,
		error:function(ajaxrequest){
			$menucontainer.html('Error fetching content. Server Response: '+ajaxrequest.responseText)
		},
		success:function(content){
			$menucontainer.html(content)
			ddsmoothmenu.buildmenu($, setting)
		}
	})
},


buildmenu:function($, setting){
	var smoothmenu=ddsmoothmenu
	var $mainmenu=$("#"+setting.mainmenuid+">ul") 
	$mainmenu.parent().get(0).className=setting.classname || "ddsmoothmenu"
	var $headers=$mainmenu.find("ul").parent()
	$headers.hover(
		function(e){
			$(this).children('a:eq(0)').addClass('selected')
		},
		function(e){
			$(this).children('a:eq(0)').removeClass('selected')
		}
	)
	$headers.each(function(i){ 
		var $curobj=$(this).css({zIndex: 100-i}) 
		var $subul=$(this).find('ul:eq(0)').css({display:'block'})
		$subul.data('timers', {})
		this._dimensions={w:this.offsetWidth, h:this.offsetHeight, subulw:$subul.outerWidth(), subulh:$subul.outerHeight()}
		this.istopheader=$curobj.parents("ul").length==1? true : false 
		$subul.css({top:this.istopheader && setting.orientation!='v'? this._dimensions.h+"px" : 0})
		if (smoothmenu.shadow.enable){
			this._shadowoffset={x:(this.istopheader?$subul.offset().left+smoothmenu.shadow.offsetx : this._dimensions.w), y:(this.istopheader? $subul.offset().top+smoothmenu.shadow.offsety : $curobj.position().top)} //store this shadow's offsets
			if (this.istopheader)
				$parentshadow=$(document.body)
			else{
				var $parentLi=$curobj.parents("li:eq(0)")
				$parentshadow=$parentLi.get(0).$shadow
			}
			this.$shadow=$('<div class="ddshadow'+(this.istopheader? ' toplevelshadow' : '')+'"></div>').prependTo($parentshadow).css({left:this._shadowoffset.x+'px', top:this._shadowoffset.y+'px'})  //insert shadow DIV and set it to parent node for the next shadow div
		}
		$curobj.hover(
			function(e){
				var $targetul=$subul 
				var header=$curobj.get(0) 
				clearTimeout($targetul.data('timers').hidetimer)
				$targetul.data('timers').showtimer=setTimeout(function(){
					header._offsets={left:$curobj.offset().left, top:$curobj.offset().top}
					var menuleft=header.istopheader && setting.orientation!='v'? 0 : header._dimensions.w
					menuleft=(header._offsets.left+menuleft+header._dimensions.subulw>$(window).width())? (header.istopheader && setting.orientation!='v'? -header._dimensions.subulw+header._dimensions.w : -header._dimensions.w) : menuleft //calculate this sub menu's offsets from its parent
					if ($targetul.queue().length<=1){ 
						$targetul.css({left:menuleft+"px", width:header._dimensions.subulw+'px'}).animate({height:'show',opacity:'show'}, ddsmoothmenu.transition.overtime)
						if (smoothmenu.shadow.enable){
							var shadowleft=header.istopheader? $targetul.offset().left+ddsmoothmenu.shadow.offsetx : menuleft
							var shadowtop=header.istopheader?$targetul.offset().top+smoothmenu.shadow.offsety : header._shadowoffset.y
							if (!header.istopheader && ddsmoothmenu.detectwebkit){ 
								header.$shadow.css({opacity:1})
							}
							header.$shadow.css({overflow:'', width:header._dimensions.subulw+'px', left:shadowleft+'px', top:shadowtop+'px'}).animate({height:header._dimensions.subulh+'px'}, ddsmoothmenu.transition.overtime)
						}
					}
				}, ddsmoothmenu.showhidedelay.showdelay)
			},
			function(e){
				var $targetul=$subul
				var header=$curobj.get(0)
				clearTimeout($targetul.data('timers').showtimer)
				$targetul.data('timers').hidetimer=setTimeout(function(){
					$targetul.animate({height:'hide', opacity:'hide'}, ddsmoothmenu.transition.outtime)
					if (smoothmenu.shadow.enable){
						if (ddsmoothmenu.detectwebkit){ 
							header.$shadow.children('div:eq(0)').css({opacity:0})
						}
						header.$shadow.css({overflow:'hidden'}).animate({height:0}, ddsmoothmenu.transition.outtime)
					}
				}, ddsmoothmenu.showhidedelay.hidedelay)
			}
		) 
	}) 
	$mainmenu.find("ul").css({display:'none', visibility:'visible'})
},

init:function(setting){
	if (typeof setting.customtheme=="object" && setting.customtheme.length==2){ 
		var mainmenuid='#'+setting.mainmenuid
		var mainselector=(setting.orientation=="v")? mainmenuid : mainmenuid+', '+mainmenuid
		document.write('<style type="text/css">\n'
			+mainselector+' ul li a {background:'+setting.customtheme[0]+';}\n'
			+mainmenuid+' ul li a:hover {background:'+setting.customtheme[1]+';}\n'
		+'</style>')
	}
	this.shadow.enable=(document.all && !window.XMLHttpRequest)? false : this.shadow.enable 
	jQuery(document).ready(function($){ 
		if (typeof setting.contentsource=="object"){ 
			ddsmoothmenu.getajaxmenu($, setting)
		}
		else{
			ddsmoothmenu.buildmenu($, setting)
		}
	})
}

} 
