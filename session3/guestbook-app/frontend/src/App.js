import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [guestbookEntries, setGuestbookEntries] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/guestbook')
            .then((response) => response.json())
            .then((data) => setGuestbookEntries(data));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/api/guestbook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, message, password }),
        })
            .then((response) => response.json())
            .then((newEntry) => {
                setGuestbookEntries([newEntry, ...guestbookEntries]);
                setName('');
                setMessage('');
                setPassword('');
            });
    };

    const handleDelete = (id) => {
      const userPassword = prompt('비밀번호를 입력하세요:');
      fetch(`http://localhost:3001/api/guestbook/${id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: userPassword }),
      }).then((response) => {
          if (response.status === 403) {
              alert('비밀번호가 일치하지 않습니다.');
          } else {
              // 기본 목록에서 항목 삭제
              setGuestbookEntries(guestbookEntries.filter((entry) => entry.id !== id));
              // 검색 결과 목록에서도 항목 삭제
              setFilteredEntries(filteredEntries.filter((entry) => entry.id !== id));
          }
      });
  };
  

  const handleEdit = (id) => {
    const newMessage = prompt('수정할 메시지를 입력하세요:');
    const userPassword = prompt('비밀번호를 입력하세요:');
    fetch(`http://localhost:3001/api/guestbook/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage, password: userPassword }),
    }).then((response) => {
        if (response.status === 403) {
            alert('비밀번호가 일치하지 않습니다.');
        } else {
            response.json().then((updatedEntry) => {
                // 기본 목록에서 항목 업데이트
                setGuestbookEntries(guestbookEntries.map((entry) =>
                    entry.id === id ? updatedEntry : entry
                ));
                // 검색 결과 목록에서도 항목 업데이트
                setFilteredEntries(filteredEntries.map((entry) =>
                    entry.id === id ? updatedEntry : entry
                ));
            });
        }
    });
};

    //좋아요 기능
    const handleLike = (id) => {
        fetch(`http://localhost:3001/api/guestbook/${id}/like`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    response.json().then((updatedEntry) => {
                        // 기본 목록 업데이트
                        setGuestbookEntries(guestbookEntries.map((entry) => (entry.id === id ? updatedEntry : entry)));

                        // 검색 결과 목록도 업데이트
                        setFilteredEntries(filteredEntries.map((entry) => (entry.id === id ? updatedEntry : entry)));
                    });
                } else {
                    alert('좋아요 업데이트에 실패했습니다.');
                }
            })
            .catch((error) => {
                console.error('좋아요 업데이트 중 오류가 발생했습니다.', error);
            });
    };

    // 검색 기능
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredEntries, setFilteredEntries] = useState([]);

    const handleSearch = () => {
        fetch(`http://localhost:3001/api/guestbook/search?query=${searchQuery}`)
            .then((response) => response.json())
            .then((data) => setFilteredEntries(data))
            .catch((error) => console.error('검색 중 오류 발생:', error));
    };

    return (
        <div className="App">
            <h1>방명록</h1>

            {/* 검색 기능 추가 */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch}>검색</button>
            </div>

            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required />
                <textarea placeholder="메시지" value={message} onChange={(e) => setMessage(e.target.value)} required />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">남기기</button>
            </form>

            <h2>방명록 목록</h2>

            {/* 검색 결과가 있을 경우 필터링된 항목을, 없을 경우 전체 목록을 표시 */}
            {filteredEntries.length > 0 ? (
                <ul>
                    {filteredEntries.map((entry) => (
                        <li key={entry.id}>
                            <strong>{entry.name}:</strong> {entry.message} <br />
                            <p>좋아요: {entry.likes}</p> {/* 좋아요 수 표시 */}
                            <small>{new Date(entry.created_at).toLocaleString()}</small> <br />
                            <button onClick={() => handleEdit(entry.id)}>수정</button>
                            <button onClick={() => handleDelete(entry.id)}>삭제</button>
                            <button onClick={() => handleLike(entry.id)}>좋아요</button>
                        </li>
                    ))}
                </ul>
            ) : searchQuery ? (
                <p>검색 결과가 없습니다.</p>
            ) : (
                <ul>
                    {guestbookEntries.map((entry) => (
                        <li key={entry.id}>
                            <strong>{entry.name}:</strong> {entry.message} <br />
                            <p>좋아요: {entry.likes}</p> {/* 좋아요 수 표시 */}
                            <small>{new Date(entry.created_at).toLocaleString()}</small> <br />
                            <button onClick={() => handleEdit(entry.id)}>수정</button>
                            <button onClick={() => handleDelete(entry.id)}>삭제</button>
                            <button onClick={() => handleLike(entry.id)}>좋아요</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;
