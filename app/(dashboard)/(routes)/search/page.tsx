import { getCategories } from "@/actions/categories"
import { getCoursesWithCategory } from "@/actions/courses";
import CoursesList from "@/components/common/courses-list";
import Categories from "@/components/dashboard/search/categories";
import SearchInput from "@/components/dashboard/search/search-input";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId:string;
  }
}

const SearchPage = async ({searchParams}:SearchPageProps) => {

  const {categoryId,title} = searchParams;
  const categories = await getCategories();
  const courses = await getCoursesWithCategory({categoryId,title});

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 ">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  )
}

export default SearchPage