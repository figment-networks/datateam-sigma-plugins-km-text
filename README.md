# Sigma Plugins - KM Text

## Summary

Sigma allows third-party applications to be used in its product as plugins, which interact with Sigma's plugin API to render worksheet data in visualizations that aren't otherwise available in Sigma's standard suite of UI elements (which are somewhat limited, especially when compared to JS libraries like ChartJS, Highcharts, and Apex). Sigma has additional documentation on its architecture for plugins [here](https://help.sigmacomputing.com/hc/en-us/articles/4410322911123-Develop-Sigma-Plugins).

## Why Make This?

About 70% of the knowledge management (KM) content is in a multi-line text format. Early, we identified that this content would suffer from legibility issues if it weren't formatted. One of the primary reasons that HelpJuice was selected as a vendor to produce and manage this type of content is because it allowed articles to be stored in HTML (or Markdown) format, not only for display on its front-end platform, but also when the articles are accessed through its API.

Sigma doesn't have the ability to render HTML content in any of its UI elements. The text input element only displays unformatted text, and any formatting selected in Sigma menus applies to the entire text input element (not parts of it). Additionally, Sigma UI elements suffer from issues that would negatively impair legibility of text, such as minimal control over formatting, alignment, scrolling breakpoints, and an absence of horizontal scrolling (which is an issue given that there is no minimum width parameter on the page).

**In short, the vast majority of KM content can't be deployed on Sigma without providing a solution to these text legibility issues.** If this issue isn't resolved, this content will either continue to be difficult for internal users to access, or would require publishing the content on a different platform (and the organization is making a concerted effort to reduce the number of platforms, particularly if they can be consolidated). Here, adding this narrative content is particularly helpful in Sigma, since it's intended to be a long-term solution for the organization for data visualization and analytics tools.

## How Was It Made?

**The application is a basic React application in JS with the Sigma plugin developer tool libraries installed.** It could be deployed anywhere, but deploying through GitHub pages was selected for ease of use and flexibility in case small changes need to be made. Once it's deployed, a Sigma admin must add the URL of the deployment to a custom plugin; this option is located in the "administration" menu in Sigma, at the bottom of the page in a section titled "custom plugins." After the admin adds a plugin name, description, and the production URL for the deployment, the plugin will be set up and available for any creator to utilize in any workbook.

The plugin is primarily designed to work with HTML-formatted text content from the KM Compositions database (available through HelpJuice API and stored in Snowflake in the Protocol DB repository). When this content is stored in Snowflake, a large amount of metadata comes through as well regarding authorship, article creation and expiration dates, external links, and other parameters. The plugin is designed around this schema, as it allows users to query a block of articles using search parameters (such as topic, category, or protocol) and display a specific row (as opposed to making a separate query or table for each article that a user wishes to display on the page). Then, the user can select which columns to use from the query results table to display title, article body, and article attribute data.

![](/screenshot.png) 

KM article body text is rendered in HTML. It can be edited in HelpJuice by clicking on the URL of the article and logging into the system (non-authors can submit article feedback, including sentiment and specific comments or criticism). It uses a library to sanitize the content to prevent SQL injection (although the risk is extremely remote anyway, since the only content that can be displayed is HTML content stored in Snowflake; it doesn't allow HTML content from other sources to be displayed through the plugin). Additional parameters that can be modified are article title font size, article title font color, and the minimum width of the UI element (which will enable side-scrolling). The row number selector value doesn't need to be enclosed in quotes, but the other three parameters in the menu do require enclosure in quotes to render correctly. 

## Known Issues, Areas for Improvement

**If the UI element is blank, it likely needs refreshed. This isn't any more or less common than any other issue with a Sigma UI element, but unlike standard UI elements, if information fails to load for whatever reason, it will display no data instead of an error message.**

Before any data is added to the menu, the plugin will display an error message: "No data available for the specified row number." It resolves after a row number is entered and saved. If an invalid row number is selected, no data will be displayed. The code accounts for the first item in an ordered list being valued at 0, so to select the first row, a value of "1" should be entered. 

**The plugin requires at least one column to be selected as a title, one column to be selected for the body text, and one column to be selected as an attribute.** Only one title and body text column can be selected at a time, but many attributes can be selected. However, they must all be formatted as strings to work correctly (this was intentional). 

**If a user tries to pass a non-string value, the plugin will break, and will display no data.** To convert non-string data to string data, right-click on the column for the data source table, scroll down to "transform" in the menu, and select "convert to text." Then, refresh the plugin (if necessary).

Additional customization could be added through additional menu options, but I left out any additional options other than the ones displayed intentionally. If a large amount of customization is desired, the best thing to do would be to clone the plugin and modify the CSS file to render elements however desired.

**This plugin can be forked to provide a good starting point for developing other custom visualizations.** In theory, any plugin that would display in Sigma could also be deployed, identically, in FigApp. So, for data-intensive features or interactive features/tools on the FigApp, Sigma embedded analytics should be considered instead of developing bespoke JS applications, as it would provide a framework that would eliminate a lot of the time required to deploy.
