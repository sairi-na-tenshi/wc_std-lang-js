with( FParser ) new function(){

	var wrapRemark= FWrapper( 'std:lang-js-remark' )
	var wrapString= FWrapper( 'std:lang-js-string' )
	var wrapKeyword= FWrapper( 'std:lang-js-keyword' )
	var wrapRegexp= FWrapper( 'std:lang-js-regexp' )
	var wrapRegexpControl= FWrapper( 'std:lang-js-regexp-control' )
	var wrapBracket= FWrapper( 'std:lang-js-bracket' )
	var wrapGhost= FWrapper( 'std:lang-js-ghost' )

	lang.js_regexp= FParser( new function(){
		
		this.escaping= new function(){
			this.regexp= /\\([^\\])/
			var marker= wrapGhost( '\\' )
			this.handler= function( symbol ){
				return [ marker, symbol ]
			}
		}

		this.control= new function(){
			this.regexp= /([(){}\[\]$^])/
			this.handler= wrapRegexpControl
		}

	})

	lang.js_content= FParser( new function(){
		
		this.remarkMulti= new function(){
			this.regexp= /(\/\*[\s\S]*?\*\/)/
			this.handler= wrapRemark
		}

		this.remarkOne= new function(){
			this.regexp= /(\/\/[^\n]*)/
			this.handler= wrapRemark
		}

		this.string1= new function(){
			this.regexp= /('(?:[^\n'\\]*(?:\\\\|\\[^\\]))*[^\n'\\]*')/
			this.handler= wrapString
		}

		this.string2= new function(){
			this.regexp= /("(?:[^\n"\\]*(?:\\\\|\\[^\\]))*[^\n"\\]*")/
			this.handler= wrapString
		}

		this.regexp= new function(){
			this.regexp= /(\/(?:[^\n\/\\]*(?:\\\\|\\[^\\]))*[^\n\/\\]*\/)/
			this.handler= function( content ){
				var parse= lang.pcre
				if( parse ) content= parse( content )
				return wrapRegexp( content )
			}
		}

		this.keyword= new function(){
			this.regexp= /\b(this|function|new|var|if|else|switch|case|default|for|in|while|do|with|boolean|continue|break|throw|true|false|try|catch|null|typeof|instanceof|return|delete)\b/
			this.handler= wrapKeyword
		}

		this.bracket= new function(){
			this.regexp= /([(){}\[\]])/
			this.handler= wrapBracket
		}

	})

	lang.js= FPipe( lang.js_content, FWrapper( 'std:lang-js' ) )

}
