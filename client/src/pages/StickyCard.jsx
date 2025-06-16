import React, { useState, useEffect } from "react";
import axios from "axios";
import noevents from "../images/images.png";

const Stickycards = () => {
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState("");
  const [userRole, setUserRole] = useState("");
  const [description, setDescription] = useState("");
  const [editCard, setEditCard] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  // Fetch sticky cards
  const fetchCards = async () => {
    try {
      const response = await axios.get(
        "https://global-hrm-mobile-server.vercel.app/news/getAllStickyCards"
      );
      console.log("Fetched cards:", response.data); // Debugging
      setCards(response.data);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Create a new sticky card
  const createCard = async () => {
    try {
      const response = await axios.post(
        "https://global-hrm-mobile-server.vercel.app/news/addStickyCard",
        {
          title,
          description,
        }
      );
      setCards([response.data, ...cards]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  // Update an existing sticky card
  const updateCard = async () => {
    console.log("editCard state before update:", editCard); // Debugging
    if (!editCard || !editCard.id) {
      console.error("Invalid editCard state");
      return;
    }
    try {
      const response = await axios.put(
        `https://global-hrm-mobile-server.vercel.app/news/updateStickyCard/${editCard.id}`,
        { title, description }
      );
      console.log("Updated card response:", response.data); // Debugging
      setCards(
        cards.map((card) => (card.id === editCard.id ? response.data : card))
      );
      setEditCard(null);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  // Delete a sticky card
  const deleteCard = async (id) => {
    try {
      await axios.delete(`https://global-hrm-mobile-server.vercel.app/news/deleteStickyCard/${id}`);
      setCards(cards.filter((card) => card.id !== id));
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editCard) {
      updateCard();
    } else {
      createCard();
    }
  };

  // Start editing a card
  const handleEdit = (card) => {
    console.log("Editing card:", card); // Debugging
    setEditCard(card);
    setTitle(card.title);
    setDescription(card.description);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Upcoming Occation
        </h1>

        {/* Conditional render of the Create button */}
        {["Top Lvl Manager", "Ceo"].includes(userRole) && (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 mb-6"
          >
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-orange-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-400 transition-all"
            >
              {editCard ? "Update" : "Create"}
            </button>
          </form>
        )}

        {/* List of sticky cards */}
        <ul className="space-y-4">
          {cards.length > 0 ? (
            cards.map((card) => (
              <li
                key={card.id}
                className="bg-gray-50 border border-gray-200 rounded-lg shadow p-4"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {card.title}
                </h3>
                <p className="text-gray-600">{card.description}</p>
                <div className="mt-4 flex gap-2">
                  {/* Conditional rendering of Edit and Delete buttons */}
                  {["Top Lvl Manager", "Ceo"].includes(userRole) && (
                    <>
                      <button
                        onClick={() => handleEdit(card)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCard(card.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))
          ) : (
            <div className="flex justify-center items-center mt-8">
              <img
                src={noevents}
                alt="No cards available"
                className="max-w-md"
              />
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Stickycards;
