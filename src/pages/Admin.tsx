import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { useAuth } from "@/src/context/AuthContext";
import { Plus, Trash, Loader2 } from "lucide-react";

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "Appetizers",
    description: "",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
    isSignature: false,
    available: true
  });

  const fetchItems = async () => {
    try {
      const q = await getDocs(collection(db, "menuItems"));
      setItems(q.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchItems();
  }, [isAdmin]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await addDoc(collection(db, "menuItems"), {
        ...newItem,
        price: parseFloat(newItem.price),
        createdAt: serverTimestamp()
      });
      setNewItem({
        name: "",
        price: "",
        category: "Appetizers",
        description: "",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
        isSignature: false,
        available: true
      });
      fetchItems();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "menuItems");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "menuItems", id));
      fetchItems();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `menuItems/${id}`);
    }
  };

  if (authLoading) return <div className="pt-40 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-gold" /></div>;
  if (!isAdmin) return <div className="pt-40 text-center text-2xl font-serif">Unauthorized Access</div>;

  return (
    <main className="pt-32 pb-24 px-6 min-h-screen bg-charcoal">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif italic mb-12">Concierge <span className="text-gold">Admin Panel</span></h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Add Form */}
          <div className="glass p-8 space-y-6 self-start">
            <h2 className="text-xl font-serif text-gold flex items-center gap-2">
              <Plus className="w-5 h-5" /> Add New Masterpiece
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input 
                required
                className="w-full bg-black/40 border border-white/10 p-3 text-sm focus:border-gold outline-none"
                placeholder="Item Name"
                value={newItem.name}
                onChange={e => setNewItem({...newItem, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  required
                  type="number"
                  step="0.01"
                  className="w-full bg-black/40 border border-white/10 p-3 text-sm focus:border-gold outline-none"
                  placeholder="Price ($)"
                  value={newItem.price}
                  onChange={e => setNewItem({...newItem, price: e.target.value})}
                />
                <select 
                  className="w-full bg-black/40 border border-white/10 p-3 text-sm focus:border-gold outline-none"
                  value={newItem.category}
                  onChange={e => setNewItem({...newItem, category: e.target.value})}
                >
                  <option value="Appetizers">Appetizers</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Signature Cocktails">Signature Cocktails</option>
                </select>
              </div>
              <textarea 
                className="w-full bg-black/40 border border-white/10 p-3 text-sm focus:border-gold outline-none h-24"
                placeholder="Description"
                value={newItem.description}
                onChange={e => setNewItem({...newItem, description: e.target.value})}
              />
              <input 
                className="w-full bg-black/40 border border-white/10 p-3 text-sm focus:border-gold outline-none"
                placeholder="Image URL"
                value={newItem.image}
                onChange={e => setNewItem({...newItem, image: e.target.value})}
              />
              <button 
                disabled={isAdding}
                className="w-full bg-gold text-charcoal font-bold p-4 hover:bg-gold-light transition-colors flex items-center justify-center gap-2"
              >
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Creation"}
              </button>
            </form>
          </div>

          {/* List Area */}
          <div className="space-y-4">
            <h2 className="text-xl font-serif text-gold underline underline-offset-8">Current Collection</h2>
            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="bg-white/5 border border-white/5 p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <img src={item.image} className="w-16 h-16 object-cover" />
                      <div>
                        <h4 className="font-serif italic">{item.name}</h4>
                        <p className="text-xs text-white/40">{item.category} &bull; ${item.price}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-white/20 hover:text-red-500 transition-colors"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
