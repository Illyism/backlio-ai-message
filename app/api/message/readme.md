# API Message Documentation

You need to expose an publicly available API endpoint (e.g. run locally and expose with serveo.net)

It will be called with a GET request

GET https://backl-messaging-example-python-m8k6wb1p1-illyism.vercel.app/message

With the following example JSON payload: (see also documentation below)

```json
{
    "prospect_url":"https://www.best.tools/links",
    "prospect_domain":"best.tools",
    "prospect_domainrating":24,
    "prospect_is_blog":false,
    "prospect_language":"en",
    "prospect_reached_out":false,
    "prospect_links_to_us":false,
    "prospect_title":"Helpful links",
    "prospect_title_above_link":"Indiehacker tools I can recommend",
    "prospect_description":"Links I can recomment to my visitors",
    "prospect_flags": ["informal", "indiehacker"],
    "prospect_published": "2017-01-20T15:22:00.000Z",
    "prospect_updated": "2017-01-20T15:22:00.000Z",
    "email_address": "email@best.tools",
    "email_status": "sent",
    "email_url": "https://www.best.tools/contact",
    "email_title": "Contact",
    "email_count": 2,
}
```

## JSON Payload

 - **prospect_url**: The URL where your competitor's link was found
 - **prospect_domain**: The domain corresponding to the URL from which the link was found
 - **prospect_domainrating**: Taken from your ahrefs/semrush import
 - **prospect_is_blog**: A heuristic which detects if the URL from which the link was found is part of a blog
 - **prospect_language**: The HTML lang attribute of the URL from which the link was found
 - **prospect_reached_out**: True if you have already sent out a message to this site
 - **prospect_links_to_us**: True if there is a link on the URL from which the link was found to https://workbookpdf.com/
 - **prospect_title**: The title of the URL from which the link was found
 - **prospect_title_above_link**: A heuristic which detects the title under which your competitor's URL was placed
 - **prospect_description**: The meta description of the URL from which the link was found
 - **prospect_flags**: The custom flags you can configure in settings and then click via checkboxes
 - **prospect_published**: The created date of the URL from which the link was found
 - **prospect_updated**: Corresponds to the published date, but indicates when the blog post/site was last updated
 - **email_address**: The email address chosen above the message field (helpful for extracting name)
 - **email_status**: Empty if this email address has not been contacted yet for this domain, 'sent' if the email has already been sent
 - **email_url**: The URL where this email address has been found on
 - **email_title**: The title of the URL where this email address has been found
 - **email_count**: The number of URLs where this email address has been found
