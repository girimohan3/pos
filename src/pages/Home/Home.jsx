import React, {useState, useEffect} from "react";
import LayoutApp from "../../components/Layout";
import axios from 'axios';
import { Col, Row } from 'antd';
import Product from "../../components/Product";
import { useDispatch } from "react-redux";


const Home = () => {

        const dispatch = useDispatch();

        const [productData, setProductData] = useState([]);
        const [selectedCategory, setSelectedCategory] = useState('pizzas');
        const categories = [
                {
                        name: "pizzas",
                        imageUrl: "https://img.freepik.com/premium-vector/pizza-icon-fast-food-collection-food-icon-isolated_138676-504.jpg?w=2000",
                },
                {
                        name: "burgers",
                        imageUrl: "https://static.vecteezy.com/system/resources/previews/008/608/371/original/patty-cheese-burger-clip-art-illustration-delicious-hamburger-colorful-free-vector.jpg",
                },
                {
                        name: "drinks",
                        imageUrl: "https://thumbs.dreamstime.com/b/cocktail-icon-modern-flat-design-long-shadow-drink-alcohol-beverage-drink-symbol-vintage-style-eps-vector-illustration-51000873.jpg",
                },
        ]

        useEffect (() => {
        const getAllProducts = async () =>{
        try{            
                dispatch ({
                type: "SHOW_LOADING"
        });        
        const {data} = await axios.get('/api/products/getproducts');
        setProductData(data);
        dispatch ({
                type: "HIDE_LOADING",
        });
        console.log(data);
         } catch(error){
             console.log(error);
        }                        
        };getAllProducts();
         },[dispatch])

        return (
                        <LayoutApp>
                          <div className="category">
                            {categories.map((category) => (
                              <div key={category.name} className={`categoryFlex ${selectedCategory === category.name && 'category-active'}`} onClick={() => setSelectedCategory(category.name)}>
                                <h3 className="categoryName">{category.name}</h3>
                                <img src={category.imageUrl} alt={category.name} height={60} width={60} />
                              </div>
                            ))}
                          </div>
                          <Row>
                            {productData.filter((i) => i.category === selectedCategory).map((product) => (
                              <Col xs={24} sm={6} md={12} lg={6}>
                                <Product key={product.id} product={product} />
                              </Col>
                            ))}
                          </Row>
                        </LayoutApp>
        )
}





export default Home;