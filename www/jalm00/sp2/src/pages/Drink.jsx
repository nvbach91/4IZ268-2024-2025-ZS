import React, { useEffect, useState } from 'react'


const Drink = ({ id, setSelectedDrink, loading, setLoading }) => {
    const [drink, setDrink] = useState(null)
    useEffect(() => {
        if (id === undefined) return;

        const drinkID = id
        const fetchDrink = async (drinkID) => {
            setLoading(true)
            try {
                const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkID}`)
                const data = await response.json()
                //console.log(data)
                setDrink(data.drinks[0])
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.error(error)
            }
        }
        fetchDrink(drinkID)

    }, [id])


    if (!loading) {
        return (
            <div className="fixed left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] w-3/4 min-h-3/4 overflow-x-hidden">
                <div className="absolute bg-white bg-opacity-25 bg-cover bg-no-repeat"></div>
                <div className=" flex justify-center bg-black items-center rounded-3xl">
                    <div className="z-10 p-4">
                        <button className='p-2 border-[2px] border-white rounded-full px-4 text-white'
                            onClick={() => { setSelectedDrink(null) }}>
                            Go back
                        </button>
                        <h1 className='text-white text-2xl font-semibold inter text-center'>Drink</h1>
                        <div className="">
                            {drink != null && (
                                <div className="text-white text-center flex flex-col items-center my-4">
                                    Name : {drink.strDrink}
                                    <img src={drink.strDrinkThumb} alt="" className='w-72' />
                                    <p className='inter w-1/2 my-1'>Category : {drink.strCategory}</p>
                                    <p className='inter w-1/2 my-1'>Alcoholic : {drink.strAlcoholic}</p>
                                    <p className='inter w-1/2 my-1'>Glass : {drink.strGlass}</p>
                                    <p className='inter w-1/2 my-1'>Instructions : {drink.strInstructions}</p>
                                    <div className="bg-white bg-opacity-10 p-4 rounded-lg w-1/2">
                                        <p className='text-xl mt-2'>Ingredients : </p>
                                        <ul className="text-white text-center flex flex-col items-center my-4">
                                            <li> {drink.strMeasure1} {drink.strIngredient1}</li>
                                            <li> {drink.strMeasure2} {drink.strIngredient2}</li>
                                            <li> {drink.strMeasure3} {drink.strIngredient3}</li>
                                            <li> {drink.strMeasure4} {drink.strIngredient4}</li>
                                            <li> {drink.strMeasure5} {drink.strIngredient5}</li>
                                            <li> {drink.strMeasure6} {drink.strIngredient6}</li>
                                            <li> {drink.strMeasure7} {drink.strIngredient7}</li>
                                            <li> {drink.strMeasure8} {drink.strIngredient8}</li>
                                            <li> {drink.strMeasure9} {drink.strIngredient9}</li>
                                            <li> {drink.strMeasure10} {drink.strIngredient10}</li>
                                            <li> {drink.strMeasure11} {drink.strIngredient11}</li>
                                            <li> {drink.strMeasure12} {drink.strIngredient12}</li>
                                            <li> {drink.strMeasure13} {drink.strIngredient13}</li>
                                            <li> {drink.strMeasure14} {drink.strIngredient14}</li>
                                            <li> {drink.strMeasure15} {drink.strIngredient15}</li>
                                        </ul>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Drink