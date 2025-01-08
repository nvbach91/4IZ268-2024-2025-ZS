import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const INGREDIENTS_STORAGE_KEY = 'selectedIngredients'
    const storedIngredients = localStorage.getItem(INGREDIENTS_STORAGE_KEY)
    const navigate = useNavigate()
    const [allIngredients, setAllIngredients] = useState([])
    const [filteredIngredients, setFilteredIngredients] = useState(allIngredients)
    const [selectedIngredients, setSelectedIngredients] = useState(storedIngredients ? JSON.parse(storedIngredients) : [])
    const [cocktailsByIngredient, setCocktailsByIngredient] = useState({})
    const [filteredCocktails, setFilteredCocktails] = useState([])

    useEffect(() => {
        const fetchAllIngredients = async () => {
            try {
                const response = await fetch("https://thecocktaildb.com/api/json/v1/1/list.php?i=list")
                const data = await response.json()
                setAllIngredients(data.drinks || [])
            } catch (error) {
                console.error(error)
            }
        }

        fetchAllIngredients()

    }, [])

    const toggleIngredient = (ingredient) => {
        setSelectedIngredients((prev) => {
            if (prev.includes(ingredient)) {
                return prev.filter((item) => item !== ingredient) // Když je ingredience v poli, tak ji z pole odstraní
            } else {
                return [...prev, ingredient] // Když ingredence v poli není, tak ji do pole přidá
            }
        })
    }

    const filterIngredients = (ingredient) => {
        const filtered = allIngredients.filter((item) => item.strIngredient1.toLowerCase().includes(ingredient.toLowerCase()))
        setFilteredIngredients(filtered)
    }

    const instersectCocktailArrays = (arrays) => {
        if (arrays.length === 0) return []

        let result = arrays[0]

        for (let i = 1; i < arrays.length; i++) {
            const currentIds = arrays[i].map((item) => item.idDrink)
            result = result.filter((item) => currentIds.includes(item.idDrink))
            if (result.length === 0) break;
        }
        return result
    }

    useEffect(() => {
        if (selectedIngredients.length === 0) {
            setCocktailsByIngredient({})
            setFilteredCocktails([])
            return;
        }

        localStorage.setItem(INGREDIENTS_STORAGE_KEY, JSON.stringify(selectedIngredients))

        const fetchCocktails = async () => {
            try {
                const newCocktailsByIngredient = { ...cocktailsByIngredient }

                const fetchTasks = selectedIngredients.map(async (ingredient) => {
                    if (!newCocktailsByIngredient[ingredient]) {
                        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`)
                        const data = await response.json()
                        newCocktailsByIngredient[ingredient] = data.drinks || []
                    }
                });

                await Promise.all(fetchTasks)
                setCocktailsByIngredient(newCocktailsByIngredient) // asynchronní


                const arrayOfCocktails = selectedIngredients.map(ingredient => newCocktailsByIngredient[ingredient])
                const intersection = instersectCocktailArrays(arrayOfCocktails)
                setFilteredCocktails(intersection)
                console.log(intersection)
            } catch (error) {
                console.error(error)
            }
        }

        fetchCocktails()

    }, [selectedIngredients])

    useEffect(() => {
        //console.log(allIngredients)
        setFilteredIngredients(allIngredients)
    }, [allIngredients])

    useEffect(() => {
        //console.log(filteredIngredients)
    }, [filteredIngredients])

    useEffect(() => {
        console.log(selectedIngredients)
    }, [selectedIngredients])

    return (
        <div className="w-screen h-screen overflow-x-hidden">
            <div className="absolute w-screen min-h-screen bg-[url('https://i.ibb.co/6Z35Rck/bg-gradient.png')] bg-cover bg-no-repeat"></div>
            <div className="w-screen min-h-screen flex justify-center bg-black bg-[url('https://i.ibb.co/Pm8jGgq/bg-pattern.png')] items-center ">
                <div className="z-10 p-12">
                    <h1 className="text-white text-3xl z-10 inter font-medium text-center">Vyberte ingredience, ze kterých můžete namíchat nápoj</h1>
                    <div className="my-4 flex justify-center flex-col items-center">
                        <input type="text" className="border-2 border-white rounded-xl w-4/5 p-2"
                            placeholder="Vyhledat ingredience"
                            onChange={(e) => { filterIngredients(e.target.value) }}
                        />
                        <div className="w-[75%]  bg-[#333333] bg-opacity-35 mt-2 rounded-lg p-4">
                            <ul className='flex flex-wrap gap-x-2 w-full justify-center'>
                                {filteredIngredients.map((item, index) => (
                                    <li className='w-full md:w-1/2 lg:w-1/3 xl:w-1/6 flex gap-x-2 items-center text-white inter' key={index}>
                                        <input
                                            type="checkbox"
                                            checked={selectedIngredients.includes(item.strIngredient1)}
                                            value={item.strIngredient1}
                                            onChange={() => toggleIngredient(item.strIngredient1)}
                                        />
                                        <label
                                            htmlFor=""
                                            onClick={() => toggleIngredient(item.strIngredient1)}
                                        >{item.strIngredient1}</label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="w-screen h-1/2 flex justify-center items-center flex-col">
                        <h2 className='text-white text-2xl font-semibold inter'>Nabídka nápojů</h2>
                        <p className='text-gray-300 inter'>Využijte textového pole nebo otevřete nabídku ingrediencí pro zobrazení nabídky nápojů</p>
                        <div className="">
                            <ul className='flex flex-wrap gap-4 w-full justify-center my-4'>
                                {filteredCocktails.map((cocktail) => (
                                    <li key={cocktail.idDrink} className='w-full md:w-1/2 lg:w-1/3 text-xl rounded-xl xl:w-1/5 flex flex-col gap-y-2 items-center justify-center p-6 bg-white bg-opacity-10 text-white inter'>
                                        {cocktail.strDrink} <br />
                                        <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
                                        <button className='p-2 border-[2px] border-white rounded-full px-4'
                                            onClick={() => (navigate('/drink/' + cocktail.idDrink))}
                                        >Zobrazit</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Home
