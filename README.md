# secret-santa-pairing
This grabs data from an airtable form and pairs every person with somebody.

## Setup
install packages:
```bash
$ npm install
```
when you need to run, just run:
```bash
$ npm start
```
## Environment Variables
> You can copy `.env.example` and rename it to `.env` and add the following
- `AIRTABLE_API_KEY` : your airtable api key, find yours in the settings tab in airtable.
- `SLACK_WORKFLOW_URL` : the url from the first slack workflow as mentioned below

## `users` array struct
```js
[
    {
        id: String, // Slack ID
        region: String, // User Region
        address: String,
        likes: String,
    }
]
```
Everything above is mandatory for pairing. If something is blank, be sure to replace with an empty string.

### Creating the `users` array Struct
If using Airtable, you can do the following which is already
enabled in the script:
```js
async function getUsers(region) {
  const userRes = await usersTable.read({
    filterByFormula: `region = "${region}"`
  });
  const users = [];
  userRes.forEach(user => {
    users.push({
      id: user.fields.id,
      region: user.fields.region,
      address: user.fields.address,
      likes: user.fields.likes,
    });
  });
  return (users);
}
```
## Airtable base Struct
The base MUST be formatted with the following columns, you can add more, but these are the bare minimum. Case-sensitive, they must be named exactly unless you change the code.
- `Users` (table 1)
  - id (single line text)
  - region (single select)
  - address (long text)
  - likes (long text)
- `Matching` (table 2)
  - id (single line text) [main field]
  - match (single line text)
  - regionmatch (checkbox)
  - region (single select)
  - sent (lookup) [configures to `link` and `check`]
  - Remind Them Button (button) [runs script below]
  - link (linked to another record) [link this to the `checked` table, it can and should be a hidden field]
- `Checked` (table 3)
  - id (single line text)
  - check (checkbox)
  - Matched (linked to another record) [link this to the `matched` table, it can and should be a hidden field]

## Airtable Button Script
> You must have the *Scripting* app enabled.
```js
const webhookLink = "set this to the second slack workflow as mentioned below"

let table = base.getTable('Matching');
let record = await input.recordAsync('Select a record', table);
let params = {
  userId: record.name,
  recordId: record.id,
  userIdLiteral: record.name,
};

await fetch(webhookLink, {
    method: 'POST',
    body: JSON.stringify(params),
  });
console.log(`Sent a reminder to ${record.name}`);
```

## Slack Workflows
### Slack Workflow 1
![](https://cloud-3i2m5av4l.vercel.app/0image.png)
![](https://cloud-58q5567c4.vercel.app/0image.png)
![](https://cloud-4zvp7b9zc.vercel.app/0image.png)

> Create a button which moves on to a Zapier Integration that creates a new airtable record using the following config:

![](https://cloud-bij5rjs4n.vercel.app/0image.png)

### Slack Workflow 2
This one sends a user a reminder.
![](https://cloud-ce5kanve2.vercel.app/0image.png)
![](https://cloud-odcyjf21x.vercel.app/0image.png)

> Create a button which moves on to a Zapier Integration that creates a new airtable record using the following config:

![](https://cloud-bij5rjs4n.vercel.app/0image.png)

Create an issue if you have any trouble creating these!

&copy; Sarthak Mohanty 2020. Licensed under [MIT](LICENSE), see [LICENSE](LICENSE) for more info.