import { getCategories } from "@/actions/categories"
import Categories from "@/components/dashboard/search/categories";
import SearchInput from "@/components/dashboard/search/search-input";


const SearchPage = async () => {
  const categories = await getCategories();
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 ">
        <SearchInput />
      </div>
      <div className="p-6">
        <Categories items={categories} />
      </div>
    </>
  )
}

export default SearchPage