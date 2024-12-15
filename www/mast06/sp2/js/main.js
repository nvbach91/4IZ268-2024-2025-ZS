document.getElementById('fetch-data').addEventListener('click', () => {
    //TODO: replace hard-coded string with user input (we'll call the function in the listener corresponding to the search form)
    getProductById('737628064502');
  });

// TODO: define product object structure and return it instead of response.data (prbbly name, categories, nutriscore, nutri-values)
async function getProductById(barcode) {
  const requestUrl = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;

  try {
    const response = await axios.get(requestUrl);
    console.log(response.data);
  } catch(err) {
    console.log(err)
  }
};

// Retrieving multiple products -> sort by nutriscore? add custom sorting? maybe include sorting like 'nutriscore/proteins/carbs/fats/fiber asc desc'

// API Tutorial
// https://openfoodfacts.github.io/openfoodfacts-server/api/tutorial-off-api/

// Query Example
// 'https://world.openfoodfacts.net/api/v2/search?nutrition_grades_tags=c&categories_tags_en=Orange Juice&fields=code,nutrition_grades,categories_tags_en&sort_by=last_modified_t'
// search -> filter fields (example: nutrition_grades_tags=c, categories_tags_en=Orange Juice) -> in our case: most prbbly name/categories (or, if we get fancy - in 'recommend me a food product', we can filter by nutri-values such as protein amount)
// fields -> limit response object properties (code,nutrition_grades,categories_tags_en) ->
// sort_by -> sorting, i'd implement custom sorting chosen by user, deafault can be set to nutri-score