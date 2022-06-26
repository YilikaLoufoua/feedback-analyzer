import "./Dropdown.css";
import {React, useState} from "react"

export default function Dropdown({categorization, handleAddCategory}) {
    
    const categories = Object.keys(categorization);

    let [selectedCategory, setSelectedCategory] = useState("")
    let [isOpen, setIsOpen] = useState(false);

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setIsOpen(false);
    }

    return (
      <form className="dropdown">
        <div className="dropdown">
            <button 
                className="dropbtn" 
                style={{backgroundColor: (selectedCategory!="") ? '#c9daf8' : 'white'}}>{selectedCategory || 'Category'}</button>
            <div className="dropdown-content">
            { categories && categories.map((category) => (<a onClick={() => handleSelectCategory(category)}>{category}</a>))}
            </div>
        </div>
      </form>
      
    );
}

