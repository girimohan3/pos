import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LayoutApp from "../../components/Layout";
import { Button, Form, Input, Table, Select, message } from "antd";
import { DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import Modal from "antd/lib/modal/Modal";
import FormItem from "antd/es/form/FormItem";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Cart = () => {

    const [subTotal, setSubTotal] = useState(0);
    const [billPopUp, setBillPopUp] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {cartItems} = useSelector(state => state.rootReducer);

    const handlerIncrement = (record) => {
        dispatch({
            type: "UPDATE_CART",
            payload: {...record, quantity: record.quantity + 1}
        })
    }

    const handlerDecrement = (record) => {
        if(record.quantity !== 1){
        dispatch ({
            type: "UPDATE_CART",
            payload: {...record, quantity: record.quantity - 1}
        });
    }}

    const handlerDelete = (record) => {
        dispatch ({
            type: "DELETE_FROM_CART",
            payload: record
        })
    }

    const columns = [
        {
            title: "Name",
            dataIndex: "name"
        },
        {
            title: "Image",
            dataIndex: "image",
            render: (image, record) => <img src={image} alt={record.name} width={50} height={50} />
        },
        {
            title: "Price",
            dataIndex: "price"
        },
        {
            title: "Quantity",
            dataIndex: "_id",
            render: (id,record) => 
                <div>
                   <PlusOutlined className="cart-plus" onClick={() => handlerIncrement(record)} /> 
                   <strong className="cart-quantity"> {record.quantity} </strong>
                   <MinusOutlined className="cart-minus" onClick={() => handlerDecrement(record)} />
                </div>

        },
        {
            title: "Action",
            dataIndex: "_id",
            render: (id, record) => <DeleteOutlined className="cart-delete" onClick={() => handlerDelete(record)} />

        }
    ]

    useEffect (() => {

        let temp = 0 ;
        cartItems.forEach((product)=> (
            temp = temp + product.price * product.quantity
        ));
        setSubTotal(temp);

    }, [cartItems] );

    const handlerSubmit = async (value) => {
        try {
            const newObject = {
                ...value,
                cartItems,
                subTotal,
                tax: Number(((subTotal / 100) * 10).toFixed(2)),
                totalAmount: Number((Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))).toFixed(2)),
                userId: JSON.parse(localStorage.getItem("auth"))._id
            }
            await axios.post("/api/bills/addbills", newObject);
            message.success("Bill Generated!");
            localStorage.removeItem("cartItems");
            navigate("/bills");
        } catch(error) {
            message.error("Error!")
            console.log(error);
        }
    }

    return (
        <LayoutApp>
            <h2> Cart </h2>
            <Table dataSource={cartItems} columns={columns} />
            <div className="subTotal">
                <h2>Sub Total :<span> ₹{(subTotal).toFixed(2)} </span> </h2>
                <Button onClick={() => setBillPopUp(true) } className="add-new">Create Invoice</Button>
                
                <Modal title="Create Invoice" visible={billPopUp} onCancel={() => setBillPopUp(false)} footer={false} >
                <Form layout='vertical' onFinish={handlerSubmit}>
            <FormItem name="customerName" label="Customer Name">
              <Input/>
            </FormItem>
            <FormItem name="customerPhone" label="Customer Phone No.">
              <Input/>
            </FormItem>
            <FormItem name="customerAddress" label="Customer Address">
              <Input/>
            </FormItem>
            <FormItem name="paymentMethod" label="Payment Method">
              <Select>
                <Select.Option value="cash">Cash</Select.Option>
                <Select.Option value="upi">Upi</Select.Option>
                <Select.Option value="card">Card</Select.Option>
              </Select>
            </FormItem>
            <div>
                <span>Subtotal: ₹{(subTotal).toFixed(2)}</span><br/>
                <span>Tax: ₹{((subTotal / 100) * 18).toFixed(2)}</span>
                <h4>Total : {(Number(subTotal) + Number(((subTotal / 100) * 18).toFixed(2))).toFixed(2)}</h4>
            </div>

            <div className="form-btn-add">
              <Button htmlType='submit' className='add-new'>Generate Invoice</Button>
            </div>
          </Form>
                </Modal>
                
            </div>
        </LayoutApp>
    )
}

export default Cart;
