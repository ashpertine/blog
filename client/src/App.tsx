import BlogList from "./components/blog/BlogList";
import HomepageButtons from "./components/blog/HomepageButtons";

function App() {
  return <div className="p-4 flex flex-col gap-4">
    <HomepageButtons />
    <BlogList />
  </div>
}

export default App;