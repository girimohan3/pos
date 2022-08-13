import React, { useEffect, useState, useRef} from "react";
import Layout from "../../components/Layout";
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import {  EyeOutlined } from '@ant-design/icons';
import {  Button,Modal,Table } from "antd";
import { useDispatch } from "react-redux";


const Bills = () => {
    const componentRef = useRef();
    const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const {data} = await axios.get('/api/bills/getbills');
      setBillsData(data);
      dispatch({
        type: "HIDE_LOADING",
      });
      console.log(data);

    } catch(error) {
      dispatch({
        type: "HIDE_LOADING",
      });
      console.log(error);
    }
  };

  useEffect(() => {
      getAllBills();
  }, []);
  

  const columns = [
    {
        title: "ID",
        dataIndex: "_id"
    }, 
    {
        title: "Name",
        dataIndex: "customerName",
    }, 
    {
        title: "Price",
        dataIndex: "totalAmount",
    },
    {
        title: "Phone Number",
        dataIndex: "customerPhone",
    },
    {
        title: "Action",
        dataIndex: "_id",
        render:(id, record) => 
        <div>
          <EyeOutlined className="cart-edit eye" onClick={()=> {setSelectedBill(record); setPopModal(true);}} />
        </div>
        
    }
   ]

   const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


    return (
        <Layout>
           <h2>All Invoices </h2>
      <Button className='add-new' onClick={() => setPopModal(true)}>Add New</Button>
      <Table dataSource={billsData} columns={columns} bordered />
      {
        popModal && 
        <Modal title="Invoice Details" width={400} paginations={false} visible={popModal} footer={false} onCancel={() => setPopModal(false)}>
            <div className="card" ref={componentRef}>
                <div className="cardHeader">
                    <h2 className="logo"> LOGO </h2>
                    <span>Contact Us - 8121558776 </span>
                    <span>Address : Vizag </span>
                    
                </div>
                <div className="cardBody">
                    
                    <div className="group">
                        <span>Customer Name</span>
                        <span><b>{selectedBill.customerName}</b></span>
                    </div>
                    <div className="group">
                        <span>Order Date</span>
                        <span><b>{selectedBill.createdAt.toString().substring(0, 10)}</b></span>
                    </div>
                    <div className="group">
                        <span>Payment Method</span>
                        <span><b>{selectedBill.paymentMethod}</b></span>
                    </div>
                    <div className="group">
                        <span>Sub Total</span>
                        <span><b>{selectedBill.subTotal}</b></span>
                    </div>
                   
                    <div className="group">
                        <span>Tax</span>
                        <span><b>₹{selectedBill.tax}</b></span>
                    </div>
                    <div className="group">
                        <span>Total Amount</span>
                        <span><b>₹{selectedBill.totalAmount}</b></span>
                    </div>
                  
                </div>
                
                <div className="cardFooter">
                    <h4>Your Order</h4>
                        {selectedBill.cartItems.map((product)=> (
                            <>
                            <div className="footerCard">
                            <div className="group">
                        <span>Products</span>
                        <span><b>{product.name}</b></span>
                    </div>
                    <div className="group">
                        <span>Quantity</span>
                        <span><b>{product.quantity}</b></span>
                    </div>
                    <div className="group">
                        <span>Price</span>
                        <span><b>{product.price}</b></span>
                    </div>
                    
                            </div>
                            </>
                        ))}
                        <div className="footerCardTotal">
                        <span>Total Amount</span>
                        <h2><b>₹{selectedBill.totalAmount}</b></h2>
                    </div>
                    <div className="footerThanks">
                        <span>Thank you for shopping with us</span>
                    </div>
                    
                    </div>
            </div>
            <div className="bills-btn-add">
                         <Button onClick={handlePrint} htmlType="submit" className="add-new"> Print Invoice </Button>

                    </div>
        </Modal>
      }
        </Layout>
    )
}

export default Bills;
