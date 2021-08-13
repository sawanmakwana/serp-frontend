# Quick Tips

- EsLint shouting🗣 for prettier errors?
  - `npm run lint -- --fix` 👈 this should fix your issues for fixable
    changes
- missing Lodash functions? use
  [lodash alternatives](https://youmightnotneed.com/lodash/) you might
  find what you need. we might add it if things gets hard.
- learn about [semantic](https://mauss.dev/posts/semantic-commit-message) commit messages :)
- while routing useMatch to get path and url, `path` for <Route/> and `url` for <Link to={url} />
- history.push is great but not on `button` try to use `<Button as={Link} to='url'></Button>` instead of onClick with history.push,

# Additions

- eslint & prettier setup for consistant styling and rules (Thanks to
  @gombersahil)
- jsconfig - baseUrl and components wise paths
- .vscode/ -> workspace settings

# Readings
- [authentication in react appliation](https://kentcdodds.com/blog/authentication-in-react-applications)
- [pleague of linters](https://redd.one/blog/the-plague-of-linters)
- [semantic commit messages](https://mauss.dev/posts/semantic-commit-message)

# Components Structure

- this has nothing to do with best practices or anything,
- just to make every style consistant

```js
// ✅ for react Component use Function Declarations
function Component() {
  // ✅ arrows for methods
  const handleClick = () => {}

  return <></>
}
```

```js
// ❌ dont use function expression (arrow🏹 functions) for components
const Component = () => {
  // ❌ dont do this
  function handleClick() {}

  return <></>
}
```

# File-Structure

> file-names & folder-names both are supposed to be in small letter,
> use `-` if you want to separate words.

## 🪁 api/
- `useQuery` and `useMutation` custom hooks
- add them as component wise

## 📸 assets/

- for images and svgs

## 🧰 components/

- can be divided in to 2 parts,
- reusable
- single use

## 🌱 context/

- `React.createContext()`
- use same approch as used in other context
- Provider component and useContext hook for each context

## ✨ styles/

- all css files goes here.

## 📰 layout/

- layouts which stucture content in perticular way and can be reused
  goes here

## 👜 utils/

- utility functions which can be used across application

## 🥧 constants/

- constant data.

## 🎣 hooks/

- place for your react hooks

## 👌 validations/
- place for your joi schema. would be wonderful if you can use backend schema directly.

<br><br>

# 🚋 Import & Export

## Src is your baseurl for imports

- want to get something from any directory ?
- this is how you do it now
- `assets/images/image-name`
- `components/directory/filename`
- no more `../../../filename`

## Ignore Default Exports as much as you can

- if you want to lazy load you need to default export

<br><br>

# 🌐 Fetching and Mutation

## useClient()

> checkout `utils/api-client` to see how its implemented 🎡`

- your data fetching/mutation buddy
- `import {client} from hooks/useClient`
- `const client = useClient()`
- returns a promise with your token configured already you can pass
  custom config if you want to,

```javascript
client('users/1', {
  headers: {...myHeaderConfig},
  ...customConfig,
})
```

## React-Query

> _your server state doesn't belong to **Redux store**_

- would add examples once I have implemented in this project.🎯
