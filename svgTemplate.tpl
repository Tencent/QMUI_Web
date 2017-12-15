{{#hasCommon}}{{#getCommonClassName}}{{/getCommonClassName}} {
	background: url($sprite_path + "{{spriteName}}") no-repeat;
	display: inline-block;
	overflow: hidden;
	font-size: 0;
	line-height: 0;
}
{{/hasCommon}}

{{#shapes}}
{{#selector.shape}}{{expression}}{{^last}},
{{/last}}{{/selector.shape}} {
	{{#hasCommon}}background-position: {{position.relative.xy}};{{/hasCommon}}{{^hasCommon}}background: url("{{{sprite}}}") {{position.relative.xy}} no-repeat;{{/hasCommon}}
	{{#dimensions.inline}}
	width: {{width.outer}}px;
	height: {{height.outer}}px;
	{{/dimensions.inline}}
}
{{#dimensions.extra}}

{{#selector.dimensions}}
{{expression}}{{^last}},
{{/last}}{{/selector.dimensions}} {
	width: {{width.outer}}px;
	height: {{height.outer}}px;
}
{{/dimensions.extra}}

{{/shapes}}