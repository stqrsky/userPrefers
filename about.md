#CSS Color Adjustment Module Level 1
The most common preferences are a choice of “Light” vs “Dark” (or “Day Mode” vs “Night Mode”) color schemes, rendering things as mostly light- or dark-colored backgrounds, and with dark- or light-colored foregrounds (text, icons). This module, together with Media Queries Level 5, defines controls to enable color scheme negotiation for "light" and "dark" color schemes (and no preference).

To enable pages to adapt to the user’s preferred color scheme, user agents will match the prefers-color-scheme media query to the user’s preferred color scheme.

##USER PREFERS...

Additionally, if the author has indicated that the page can support this color scheme (see color-scheme), the user agent must match the following to the user’s preferred color scheme:

the initial color of the background canvas find what we name this in other specs, the initial value of the color property, and the system colors

the default colors of scrollbars and other interaction UI

the default colors of form controls and other "specially-rendered" elements

the default colors of other browser-provided UI, such as "spellcheck" underlines

### 1. Properties Affected by Forced Colors Mode
When forced colors mode is active and forced-color-adjust is auto (see below), the following user origin declarations [CSS-CASCADE-4] are applied to the element:

#####-color: revert !important;
#####-fill: revert !important;
#####-stroke: revert !important;
#####-text-decoration-color: revert !important;
#####-text-emphasis-color: revert !important;
#####-background-color: revert !important;
#####-border-color: revert !important;
#####-outline-color: revert !important;
#####-column-rule-color: revert !important;
#####-scrollbar-color: revert !important;
#####--webkit-tap-highlight-color: revert !important; /* ISSUE: This is not in a spec anywhere! */
#####-box-shadow: none !important;
#####-text-shadow: none !important;

#### Additionally, on on user input controls (except button-like controls) only:

#####-background-image: none !important;

UA may further tweak these forced colors mode heuristics to provide better user experience.


### 2.1. Opting Into a Preferred Color Scheme: the color-scheme property

Name:	color-scheme
Value:	auto | [ light | dark | <custom-ident> ]+ | only && light
Initial:	auto
Applies to:	all elements
Inherited:	yes
Percentages:	n/a
Computed value:	the keyword auto, or optional only keyword and ordered list of specified color scheme keywords, with any <custom-ident>s or repeated keywords dropped
Canonical order:	per grammar
Animation type:	discrete
The color-scheme property allows an element to indicate which color schemes it is comfortable being rendered with. These values are negotiated with the users preferences, resulting in a chosen color scheme that affects UI things such as the default colors of form controls and scrollbars as well as the used values of the CSS system colors. Its values are defined as follows:

auto
Indicates that the element isn’t aware of color schemes at all, and so the element should be rendered with the browser’s default color scheme.

[ light | dark | <custom-ident> ]+
Indicates that the element is aware of and can handle the listed color schemes, and expresses an ordered preference between them. (See §2.2 Finding the Used Color Scheme for details on how this choice is resolved.)

light represents a "light" color scheme, with light background colors and dark foreground colors. dark represents the opposite, with dark background colors and light foreground colors.

Note: Providing both keywords indicates that the first scheme is preferred, but the second is also acceptable if the user prefers it instead.

<custom-ident> values are meaningless, and exist only for future compatibility, so that future added color schemes do not invalidate the color-scheme declaration in legacy user agents. User agents must not interpret any <custom-ident> values as having a meaning; any additional recognized color schemes must be explicitly added to this property’s grammar. To avoid confusion, authoring tutorials and references should omit it from their materials.

only, auto, light, and dark are not valid <custom-ident>s in this property.

Repeating a keyword, such as color-scheme: light light, is valid but has no additional effect beyond what the first instance of the keyword provides.

only
If provided, only indicates that the element must be rendered with one of the specified color schemes, if possible, even if the user’s preference is for a different color scheme.

 Per spec, only can only be used with light. Apple’s implementation allows it with dark as well. The concern with only dark is that pages won’t consider UAs that can’t support dark schemes, and will thus render brokenly. This value might be expanded to all schemes or removed entirely depending on further consideration.

Authors should not use this value, and should instead ensure that their page renders well with whatever color scheme the user prefers (using the prefers-color-scheme media query to adjust styles accordingly). This keyword is provided only for the rare cases where that might not be reasonably possible, and using a different color scheme would render the element difficult or impossible to use.

Note that user agents are not required to support any particular color scheme, so using only to indicate a required color scheme is still not guaranteed to have any effect on the rendering of the element.

###2.2. Finding the Used Color Scheme

To find the used color scheme for an element el:
Let scheme be the keyword matching prefers-color-scheme.

If the computed value of color-scheme on el contains scheme, return scheme.

If the computed value of color-scheme on el contains the only keyword or scheme is no-preference, and at least one color scheme indicated in color-scheme is supported by the user agent, return the first keyword, in specified order, that is supported by the user agent.

Otherwise, return no-preference.

For each element, find the used color scheme for that element. If the used color scheme is no-preference, the element must be rendered with the user agent’s default color scheme. (For Web compatibility, this should be a "light" color scheme.) Otherwise, the element must be rendered with the used color scheme.

Note: This algorithm ensures that if the user prefers a non-default color scheme, it will only be used if the page claims to support it. This ensures that legacy pages, written before color scheme preferences were exposed, do not change behavior.

For all elements, rendering with a color scheme should affect the colors used in all browser-provided UI for the element—e.g. scrollbars, spellcheck underlines, form controls, etc.—to match with the intent of the color scheme.

For the root element of a page, rendering with a color scheme additionally must affect the background of the canvas, the initial value of the color property, and the system colors, and should affect the page’s scrollbars.

##2.3. The "color-scheme" meta value
To aid user agents in rendering the page background with the desired color scheme immediately (rather than waiting for all CSS in the page to load), a color-scheme value can also be provided in a meta element.

If any meta elements are inserted into a document or removed from a document, or existing meta elements have their name or content attributes changed, user agents must run the following algorithm:

Let candidate elements be the list of all meta elements that meet the following criteria, in tree order:

the element is in a document tree

the element has a name attribute, whose value is an ASCII case-insensitive match for color-scheme

the element has a content attribute, whose value is not the empty string

the element is a child of the the head element of the document

For each element in candidate elements:

If element’s content attribute’s value parses as a <color-scheme> value, treat that value as a declaration of the color-scheme property on element’s root, cascaded as a non-CSS presentational hint. Then return.

Note: Because these rules check successive elements until they find a match, an author can provide multiple such values to handle fallback for legacy user agents. Opposite how CSS fallback works for properties, the multiple meta elements must be arranged with the legacy values after the newer values.

 This algorithm favors the first meta, to allow for ASAP rendering with a chosen color scheme. Is that the desired behavior?

##3. Forced Color Schemes: the forced-color-adjust property
Forced colors mode is an accessibility feature intended to increase the readability of text through color contrast. Individuals with limited vision often find it more comfortable to read content when there is a a particular type of contrast between foreground and background colors.

Operating systems can provide built-in color themes, such as Windows’ high contrast black-on-white and high-contrast white-on-black themes. Users can also customize their own themes, for example to provide low contrast or hue contrast.

In forced colors mode, the user agent enforces the user’s preferred color palette on the page, overriding the author’s chosen colors for specific properties, see §3.1 Properties Affected by Forced Colors Mode. It may also enforce a “backplate” underneath text (similar to the way backgrounds are painted on the ::selection pseudo-element) to ensure adequate contrast for readability.

To enable pages to adapt to forced colors mode user agents will match the forced-colors media query and must provide the required color palette through the CSS system colors (see [CSS-COLOR-4]). Additionally, if the UA determines (based on Lab lightness), that the canvas color is clearly either dark or light (for some reasonable UA delineation of “dark” or “light”), then it must match the appropriate value of the prefers-color-scheme media query and express a corresponding user preference for color-scheme. This will allow pages that support light/dark color schemes to automatically adjust to more closely match the forced color scheme. Note that medium-lightness forced backgrounds may yield a prefers-color-scheme of no-preference.

##3.1. Properties Affected by Forced Colors Mode
When forced colors mode is active and forced-color-adjust is auto (see below), the following user origin declarations [CSS-CASCADE-4] are applied to the element:

color: revert !important;
fill: revert !important;
stroke: revert !important;
text-decoration-color: revert !important;
text-emphasis-color: revert !important;
background-color: revert !important;
border-color: revert !important;
outline-color: revert !important;
column-rule-color: revert !important;
scrollbar-color: revert !important;
-webkit-tap-highlight-color: revert !important; /* ISSUE: This is not in a spec anywhere! */

box-shadow: none !important;
text-shadow: none !important;
Additionally, on on user input controls (except button-like controls) only:

background-image: none !important;
UA may further tweak these forced colors mode heuristics to provide better user experience.

##3.2. Opting Out of a Forced Color Scheme: the forced-color-adjust property
Name:	forced-color-adjust
Value:	auto | none
Initial:	auto
Applies to:	all elements
Inherited:	yes
Percentages:	n/a
Computed value:	as specified
Canonical order:	per grammar
Animation type:	discrete
The forced-color-adjust property allows authors to opt particular elements out of forced colors mode, restoring full control over the colors to CSS. Values have the following meanings:

####auto
The element’s colors are automatically adjusted by the UA in forced colors mode.

####none
The element’s colors are not automatically adjusted by the UA in forced colors mode.

Authors should only use this value when they are themselves adjusting the colors to support the user’s color and contrast needs and need to make changes to the UA’s default adjustments to provide a more appropriate user experience for those elements.

 Should this property be merged with color-adjust somehow?

In order to not break SVG content, UAs are expected to add the following rules to their UA style sheet:

@namespace "http://www.w3.org/2000/svg";
svg|svg { forced-color-adjust: none; }
svg|text, svg|foreignObject { forced-color-adjust: auto; }
4. Performance-based Color Schemes: the color-adjust property
On most monitors, the color choices that authors make have no significant difference in terms of how the device performs; displaying a document with a white background or a black background is approximately equally easy.

However, some devices have limitations and other qualities that make this assumption untrue. For example, printers tend to print on white paper; a document with a white background thus has to spend no ink on drawing that background, while a document with a black background will have to expend a large amount of ink filling in the background color. This tends to look fairly bad, and sometimes has deleterious physical effects on the paper, not to mention the vastly increased printing cost from expending the extra ink. Even fairly small differences, such as coloring text black versus dark gray, can be quite different when printing, as it switches from using a single black ink to a mixture of cyan, magenta, and yellow ink, resulting in higher ink usage and lower resolution.

As a result, in some circumstances user agents will alter the styles an author specifies in some particular context, adjusting them to be more appropriate for the output device and to accommodate what they assume the user would prefer. However, in some cases the document may be using colors in important, well-thought-out ways that the user would appreciate, and so the document would like some way to hint to the user agent that it might want to respect the page’s color choices. The color-adjust property controls this.

Name:	color-adjust
Value:	economy | exact
Initial:	economy
Applies to:	all elements
Inherited:	yes
Percentages:	N/A
Computed value:	specified keyword
Canonical order:	per grammar
Animation type:	discrete
The color-adjust property provides a hint to the user-agent about how it should treat color and style choices that might be expensive or generally unwise on a given device, such as using light text on a dark background in a printed document. If user agents allow users to control this aspect of the document’s display, the user preference must be respected more strongly than the hint provided by color-adjust. It has the following values:

economy
The user agent should make adjustments to the page’s styling as it deems necessary and prudent for the output device.
For example, if the document is being printed, a user agent might ignore any backgrounds and adjust text color to be sufficiently dark, to minimize ink usage.

exact
This value indicates that the page is using color and styling on the specified element in a way which is important and significant, and which should not be tweaked or changed except at the user’s request.
For example, a mapping website offering printed directions might "zebra-stripe" the steps in the directions, alternating between white and light gray backgrounds. Losing this zebra-striping and having a pure-white background would make the directions harder to read with a quick glance when distracted in a car.

5. Acknowledgements
This specification would not be possible without the development efforts of various color adjustment features at Apple, Google, and Microsoft as well as discussions about print adjustments on www-style. In particular, the CSS Working Group would like to thank: Alison Maher, François Remy, イアンフェッティ

 List additional MSFT / Apple / Google people here.
e	auto	all elements	yes	n/a	discrete	per grammar	as specified
