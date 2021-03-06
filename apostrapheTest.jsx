import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import axios from 'axios';

import './Dashboard.css';
import Sidebar from '../../components/sidebar/Sidebar';
import Product from '../../components/products/product/Product';
import Categories from '../../components/products/categories/Categories';
import Carousel from '../../components/carousel/Carousel';
import MarketCardDashboard from '../../components/marketCardDashboard';


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            user: [],
            products: [],
            markets: [],
            requests: [],
            modalIsOpenUpdate: false,
            modalIsOpenCreate: false,
            modalProductID: '',
            item: '',
            image: '',
            id: '',
            marketName: '',
            marketImage: '',
            marketTime: '',
            modalIsOpenCreateMarket: false,
            modalIsOpenUpdateMarket: false,

        };
    };

    componentDidMount() {
        console.log(this.state)
        console.log(localStorage.getItem('jwtToken'));
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.post("/api/auth/jwt").then((res) => {
            console.log(res.data.success)
            if (res.data.success) {
                if (res.data.user.userType == "Vendor") {
                    let userInfo = res.data.user;
                    console.log(userInfo);
                    axios.get("/api/populateDashboardVendor/" + userInfo.id).then((response) => {
                        console.log(response.data)

                        this.setState({ loading: false, products: response.data, user: userInfo });
                        console.log(this.state)
                    });
                }
                else {
                    let userInfo = res.data.user;
                    axios.get("/api/populateDashboardMarket/" + userInfo.id).then((response) => {
                        this.setState({ loading: false, markets: response.data, user: userInfo });
                    });
                }

                // this.setState({ loading: false, userType: res.data.userType })

            }

        }).catch((error) => {
            console.log(error)
            this.props.history.push("/login");
        })
    }

    openModalUpdate = (childData, event) => {
        const prodItem = childData.item;
        const prodImg = childData.image;
        const prodId = childData.id;
        this.setState({ modalIsOpenUpdate: true, item: prodItem, image: prodImg, id: prodId });
    }

    afterOpenModalUpdate = () => {
        // references are now sync'd and can be accessed.
        // this.subtitle.style.color = '#f00';
    }

    closeModalUpdate = () => {
        this.setState({ modalIsOpenUpdate: false, item: '', image: '' });
    }

    onSubmitUpdate = (e) => {
        e.preventDefault();
        console.log(this.state.user)
        const item = this.state.item;
        const image = this.state.image;
        const id = this.state.id;
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.put('/api/updateProduct/' + id, { item, image })
            .then((res) => {
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
                axios.get('/api/populateProducts/' + this.state.user.id)
                    .then((res) => {
                        this.setState({ products: res.data, modalIsOpenUpdate: false, item: '', image: '', id: '' });
                        console.log(this.state)
                    })
                // this.props.history.push("/login");
            }).catch((err) => {
                console.log(err);
            })
    }

    openModalCreate = () => {
        this.setState({ modalIsOpenCreate: true });
    }

    afterOpenModalCreate = () => {

    }

    closeModalCreate = () => {
        this.setState({ modalIsOpenCreate: false, item: '', image: '' });
    }

    onSubmitCreate = (e) => {
        e.preventDefault();
        console.log(this.state.user)
        const item = this.state.item;
        const image = this.state.image
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.post('/api/newProduct', { item, image })
            .then((res) => {
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
                axios.get('/api/populateProducts/' + this.state.user.id)
                    .then((res) => {
                        this.setState({ products: res.data, modalIsOpenCreate: false, item: '', image: '' });
                        console.log(this.state)
                    })
                // this.props.history.push("/login");
            }).catch((err) => {
                console.log(err);
            })
    }

    onDeleteProducts = (childData) => {
        console.log('clicked');
        const id = childData.id;
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.delete('/api/deleteProduct/' + id)
            .then((res) => {
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
                axios.get('/api/populateProducts/' + this.state.user.id)
                    .then((res) => {
                        this.setState({ products: res.data })
                    })
            }).catch((err) => {
                console.log(err);
            })


    }

    onChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    }

    openModalCreateMarket = () => {
        this.setState({ modalIsOpenCreateMarket: true });
    }

    afterOpenModalCreateMarket = () => {

    }

    closeModalCreateMarket = () => {
        this.setState({ modalIsOpenCreateMarket: false, market: '', marketImage: '' });
    }

    onSubmitCreateMarket = (e) => {
        e.preventDefault();
        const marketName = this.state.marketName;
        const marketImage = this.state.marketImage;
        const marketTime = this.state.marketTime;
        const marketAddress = this.state.marketAddress;
        const marketZip = this.state.marketZip;
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.post('/api/newMarket', { marketName, marketImage, marketTime, marketAddress, marketZip })
            .then((res) => {
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
                axios.get('/api/populateDashboardMarket/' + this.state.user.id)
                    .then((res) => {
                        console.log(res.data)
                        this.setState({ markets: res.data, modalIsOpenCreateMarket: false });
                        console.log(this.state)
                    })
                // this.props.history.push("/login");
            }).catch((err) => {
                console.log(err);
            })

    }

    openModalUpdateMarket = () => {
        this.setState({ modalIsOpenUpdateMarket: true });
    }

    onDeleteMarkets = () => {

    }



    render() {
        return (
            <div className='dashboard'>
                <div className='container'>
                    <div className="container pb-5">

                        <div className="row">

                            <div className="col-lg-3">

                                <h1 className="my-4">Shop Name</h1>

                                <Categories />

                            </div>

                            <div className="col-lg-9">

                                <Carousel />

                                <div className="row">

                                    {this.state.loading ?
                                        (null)
                                        : this.state.user.userType === "Vendor" ?
                                            (this.state.products[0] === undefined ?

                                                (<div className="px-3">
                                                    <div>
                                                        <button className="btn btn-primary w-100 mb-3" onClick={this.openModalCreate} id="createProduct">Add a Product</button>
                                                        <h1>You don't have any products...Would you like to create one?</h1>
                                                    </div>
                                                    <Modal isOpen={this.state.modalIsOpenCreate}
                                                        onAfterOpen={this.afterOpenModalCreate}
                                                        onRequestClose={this.closeModalCreate}
                                                        // style={customStyles}
                                                        contentLabel="Example Modal">
                                                        <h2 ref={subtitle => this.subtitle = subtitle}>Add a new Product to your inventory</h2>

                                                        <div>Product Information</div>
                                                        <form onSubmit={this.onSubmitCreate}>
                                                            <div className="form-group mt-4 mb-5">
                                                                <label htmlFor="item">Product Name</label>
                                                                <input type="text" className="form-control border-top-0 border-left-0 border-right-0" aria-describedby="item" placeholder="Product Name" name='item' value={this.state.item} onChange={this.onChange} required />
                                                            </div>
                                                            <div className="form-group mt-4 mb-5">
                                                                <label htmlFor="image">Image URL</label>
                                                                <input type="text" className="form-control border-top-0 border-left-0 border-right-0" aria-describedby="imageURL" placeholder="Image URL" name='image' value={this.state.image} onChange={this.onChange} required />
                                                            </div>
                                                            <button className="btn" type="submit">Submit</button>
                                                        </form>
                                                        <button className="btn" onClick={this.closeModalCreate}>Cancel</button>
                                                    </Modal>
                                                </div>)
                                                : (<div className="col">
                                                    <div className="row"><h1>Products</h1></div>
                                                    <div className="row">
                                                        {this.state.products.map(product => (
                                                            <Product isDashboard={true}
                                                                item={product.item}
                                                                img={product.image}
                                                                modalOpen={(e) => { this.openModalUpdate(product, e) }}
                                                                deleteProduct={() => { this.onDeleteProducts(product) }}>
                                                            </Product>
                                                        ))}
                                                    </div>
                                                    <button className="btn" onClick={this.openModalCreate} id="createProduct">Add a Product</button>
                                                    <Modal isOpen={this.state.modalIsOpenCreate}
                                                        onAfterOpen={this.afterOpenModalCreate}
                                                        onRequestClose={this.closeModalCreate}
                                                        // style={customStyles}
                                                        contentLabel="Example Modal">
                                                        <h2 ref={subtitle => this.subtitle = subtitle}>Add a new Product to your inventory</h2>

                                                        <div>Product Information</div>
                                                        <form onSubmit={this.onSubmitCreate}>
                                                            <div className="form-group mt-4 mb-5">
                                                                <label htmlFor="item">Product Name</label>
                                                                <input type="text" className="form-control border-top-0 border-left-0 border-right-0" aria-describedby="item" placeholder="Product Name" name='item' value={this.state.item} onChange={this.onChange} required />
                                                            </div>
                                                            <div className="form-group mt-4 mb-5">
                                                                <label htmlFor="image">Image URL</label>
                                                                <input type="text" className="form-control border-top-0 border-left-0 border-right-0" aria-describedby="imageURL" placeholder="Image URL" name='image' value={this.state.image} onChange={this.onChange} required />
                                                            </div>
                                                            <button className="btn" type="submit">Submit</button>
                                                        </form>
                                                        <button className="btn" onClick={this.closeModalCreate}>Cancel</button>
                                                    </Modal>
                                                    <Modal isOpen={this.state.modalIsOpenUpdate}
                                                        onAfterOpen={this.afterOpenModalUpdate}
                                                        onRequestClose={this.closeModalUpdate}
                                                        // style={customStyles}
                                                        contentLabel="Example Modal">
                                                        <h2 ref={subtitle => this.subtitle = subtitle}>Edit Your Product</h2>
                                                        <div>Product Information</div>
                                                        <form onSubmit={this.onSubmitUpdate}>
                                                            <div className="form-group mt-4 mb-5">
                                                                <label htmlFor="item">Product Name</label>
                                                                <input type="text" className="form-control border-top-0 border-left-0 border-right-0" aria-describedby="item" placeholder="Product Name" name='item' value={this.state.item} onChange={this.onChange} required />
                                                            </div>
                                                            <div className="form-group mt-4 mb-5">
                                                                <label htmlFor="image">Image URL</label>
                                                                <input type="text" className="form-control border-top-0 border-left-0 border-right-0" aria-describedby="imageURL" placeholder="Image URL" name='image' value={this.state.image} onChange={this.onChange} required />
                                                            </div>
                                                            <button className="btn" type="submit">Submit</button>
                                                        </form>
                                                        <button className="btn" onClick={this.closeModalUpdate}>Cancel</button>
                                                    </Modal>

                                                </div>)
                                            ) : this.state.markets === null ?
                                                (<div>
                                                    <div><h1>You don't have a market.....Would you like to create one?</h1> <button className="btn" onClick={this.openModalCreateMarket} id="createMarket">Add a Market</button></div>
                                                    <Modal isOpen={this.state.modalIsOpenCreateMarket}
                                                        onAfterOpen={this.afterOpenModalCreateMarket}
                                                        onRequestClose={this.closeModalCreateMarket}
                                                        // style={customStyles}
                                                        contentLabel="Example Modal">
                                                        <h2 ref={subtitle => this.subtitle = subtitle}>Add a new Market</h2>

                                                        <div>Market Information</div>
                                                        <form onSubmit={this.onSubmitCreateMarket}>
                                                            <div className="form-group mt-4 mb-5">
                                                                <label htmlFor="market">Market Name</label>
                                                                <input type="text" className="form-control border-top-0 border-left-0 border-right-0" aria-describedby="item" placeholder="Market Name" name='marketName' value={this.state.marketName} onChange={this.onChange} required />
                                                            </div>
                                                            <div className="form-group mt-4 mb-5">
                                                                <label htmlFor="marketImage">Image URL</label>
                                                                <input type="text" className="form-control border-top-0 border-left-0 border-right-0" aria-describedby="imageURL" placeholder="Image URL" name='marketImage' value={this.state.marketImage} onChange={this.onChange} required />
                                                            </div>
                                                            <div className="form-group mt-4 mb-5">
                                                                <label htmlFor="marketLocation">Market Address</label>
                                                                <input type="text" className="form-control border-top-0 border-left-0 border-right-0" aria-describedby="imageURL" placeholder="Image URL" name='marketAddress' value={this.state.marketAddress} onChange={this.onChange} required />
                                                            </div>
                                                            <div className="form-group mt-4 mb-5">
                                                                <label htmlFor="marketLocation">Market Zip</label>
                                                                <input type="text" className="form-control border-top-0 border-left-0 border-right-0" aria-describedby="imageURL" placeholder="Image URL" name='marketZip' value={this.state.marketZip} onChange={this.onChange} required />
                                                            </div>
                                                            <div className="form-group mt-4 mb-5">
                                                                <label htmlFor="marketTime">Market Schedule</label>
                                                                <input type="text" className="form-control border-top-0 border-left-0 border-right-0" aria-describedby="imageURL" placeholder="Image URL" name='marketTime' value={this.state.marketTime} onChange={this.onChange} required />
                                                            </div>
                                                            <button className="btn" type="submit">Submit</button>
                                                        </form>
                                                        <button className="btn" onClick={this.closeModalCreateMarket}>Cancel</button>
                                                    </Modal>
                                                </div>)
                                                : ( <div>
                                                    <MarketCardDashboard
                                                        name={this.state.markets.marketName}
                                                        marketLocation={this.state.markets.marketAddress}
                                                        marketTime={this.state.markets.marketTime}
                                                        modalOpen={(e) => { this.openModalUpdateMarket(this.state.markets, e) }}
                                                        deleteMarket={() => { this.onDeleteMarkets(this.state.markets) }}>
                                                    </MarketCardDashboard>
                                                    <Modal isOpen={this.state.modalIsOpenUpdateMarket}
                                                    onAfterOpen={this.afterOpenModalUpdateMarket}
                                                    onRequestClose={this.closeModalUpdateMarket}
                                                    // style={customStyles}
                                                    contentLabel="Example Modal">
                                                    <h2 ref={subtitle => this.subtitle = subtitle}>Edit Your Market</h2>

                                                    <div>Market Information</div>
                                                    <form onSubmit={this.onSubmitUpdateMarket}>
                                                        <div className="form-group mt-4 mb-5">
                                                            <label htmlFor="market">Market Name</label>
                                                            <input type="text" className="form-control border-top-0 border-left-0 border-right-0" aria-describedby="item" placeholder="Market Name" name='marketName' value={this.state.marketName} onChange={this.onChange} required />
                                                        </div>
                                                        <div className="form-group mt-4 mb-5">
                                                            <label htmlFor="marketImage">Image URL</label>
                                                            <input type="text" className="form-control border-top-0 border-left-0 border-right-0" aria-describedby="imageURL" placeholder="Image URL" name='marketImage' value={this.state.marketImage} onChange={this.onChange} required />
                                                        </div>
                                                        <div className="form-group mt-4 mb-5">
                                                            <label htmlFor="marketLocation">Market Address</label>
                                                            <input type="text" className="form-control border-top-0 border-left-0 border-right-0" aria-describedby="imageURL" placeholder="Image URL" name='marketAddress' value={this.state.marketAddress} onChange={this.onChange} required />
                                                        </div>
                                                        <div className="form-group mt-4 mb-5">
                                                            <label htmlFor="marketLocation">Market Zip</label>
                                                            <input type="text" className="form-control border-top-0 border-left-0 border-right-0" aria-describedby="imageURL" placeholder="Image URL" name='marketZip' value={this.state.marketZip} onChange={this.onChange} required />
                                                        </div>
                                                        <div className="form-group mt-4 mb-5">
                                                            <label htmlFor="marketTime">Market Schedule</label>
                                                            <input type="text" className="form-control border-top-0 border-left-0 border-right-0" aria-describedby="imageURL" placeholder="Image URL" name='marketTime' value={this.state.marketTime} onChange={this.onChange} required />
                                                        </div>
                                                        <button className="btn" type="submit">Submit</button>
                                                    </form>
                                                    <button className="btn" onClick={this.closeModalUpdateMarket}>Cancel</button>
                                                </Modal>
                                                </div>
                                                )}



                                </div>
                                {/* <!-- /.row --> */}

                            </div>
                            {/* <!-- /.col-lg-9 --> */}

                        </div>
                        {/* <!-- /.row --> */}

                    </div>

                </div>
            </div>
        )
    }
}
export default Dashboard;





















        // First
        //SELLER    
        //sidebar (in the container not the root)
           //manage products
               //initially generates all of the users products on the site
               //add products button
                   //modal form
                       // item name (required)
                       // item pic (optional)
                       // item description (optional)
                       // item price (optional)
               //hover picture brings x to delete product
               //click product allows user to edit products
                   //modal form
                       // item name (required)
                       // item pic (optional)
                       // item description (optional)
                       // item price (optional)
           //connect to market
               //location input
               //generates list of markets to associate ith
           //manage profile
               //create mission statement
               //profile picture
        //ORGANIZER
           //sidebar
               //farmer request (notification)
                   //list of farmers who have associated themselves with the    market
                       //accept or deny button for each
               //manage market
                   //if market does not exist
                       //create market button
                           //modal form
                               //time
                               //name
                               //image
                               //location
                       //manage market
                           //modal form
                               //time
                               //image
                               //name
                       //location