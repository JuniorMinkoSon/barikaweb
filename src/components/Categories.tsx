// Categories.tsx

const categories = [
  { id: 1, name: 'Coiffure & Beauté', count: 245, img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Plomberie', count: 189, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Ménage', count: 312, img: 'https://images.unsplash.com/photo-1581578731522-9b7d7b8bd6c1?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Électricité', count: 156, img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400' },
  { id: 5, name: 'Jardinage', count: 203, img: 'https://images.unsplash.com/photo-1523301343968-6a6ebf63c674?auto=format&fit=crop&q=80&w=400' },
  { id: 6, name: 'Peinture', count: 178, img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400' },
  { id: 7, name: 'Bricolage', count: 234, img: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?auto=format&fit=crop&q=80&w=400' },
  { id: 8, name: 'Mécanique', count: 145, img: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=400' },
];

export default function Categories() {
  return (
    <section style={{ width: '100%', backgroundColor: '#fff', padding: '40px 0' }}>
      <style>{`
        .base-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          padding: 0 16px;
        }

        .base-card {
          position: relative;
          height: 180px;
          border-radius: 12px;
          overflow: hidden;
          background-color: #f5f5f5;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .base-card:hover {
          transform: scale(1.02);
        }

        .img-fit {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .overlay-subtile {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 16px;
        }

        .pill-count {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #FF6B00;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
        }

        @media (min-width: 768px) {
          .base-grid { grid-template-columns: repeat(4, 1fr); padding: 0 32px; gap: 20px; }
          .base-card { height: 220px; }
        }

        @media (min-width: 1200px) {
          .base-grid { grid-template-columns: repeat(5, 1fr); }
        }
      `}</style>

      {/* Titre Simple & Pro */}
      <div style={{ padding: '0 16px 24px 16px', maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#000', margin: 0 }}>
          Nos <span style={{ color: '#FF6B00' }}>Catégories</span>
        </h2>
        <div style={{ width: 40, height: 3, backgroundColor: '#000', marginTop: 8 }}></div>
      </div>

      <div className="base-grid" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {categories.map((cat) => (
          <div key={cat.id} className="base-card">
            <img src={cat.img} alt={cat.name} className="img-fit" />
            <div className="pill-count">{cat.count}</div>
            <div className="overlay-subtile">
              <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: 0 }}>
                {cat.name}
              </h3>
            </div>
          </div>
        ))}

        {/* Case simple Voir Plus */}
        <div className="base-card" style={{ 
          backgroundColor: '#000', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '1px solid #eee'
        }}>
           <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>Toutes les catégories →</span>
        </div>
      </div>
    </section>
  );
}