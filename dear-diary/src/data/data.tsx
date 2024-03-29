export interface UserData {
    email: string;
    name: string;
    password: string;
}

export const setUserData = (json: UserData) => {
    localStorage.setItem('name', json.name);
    localStorage.setItem('email', json.email);
    localStorage.setItem('password', json.password);
}

export const setLogged = (bool: string) => {
    localStorage.setItem('logged', bool);
}

export const getLogged = () => {
    return localStorage.getItem('logged') === 'true';
}

export const savePin = (pin: string) => {
    localStorage.setItem('pin', pin);
}

export const getPin = () => {
    return localStorage.getItem('pin');
}

export const sha256 = async (s: string) => {
    return s;
};

const generateUUID = (): string => {
    const s4 = (): string => {
        return Math.floor((1 + Math.random()) * 0x100000000)
            .toString(16)
            .substring(1);
    };
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

export interface Entry {
    feeling: any;
    content: string;
    date: string;
    title: string;
    topics: string[];
    id: string;
}

export const setActualEntry = (entry: Entry) => {
    localStorage.setItem('actualEntry', JSON.stringify(entry))
}
export const getActualEntry = () => {
    return JSON.parse(localStorage.getItem('actualEntry') || '{}') as Entry
}

export const getLatestEntry = () => {
    const entries = JSON.parse(localStorage.getItem('entries') || '[]') as Entry[];
    return entries[0];
}

export const getNewEntry = () => {
    return JSON.parse(localStorage.getItem('newEntry') || '{}') as Entry
}
export const addNewEntry = (entry: Entry) => {
    const entries = JSON.parse(localStorage.getItem('entries') || '[]') as Entry[];
    entry.id = generateUUID();
    entries.unshift(entry);
    localStorage.setItem('entries', JSON.stringify(entries));
}

export const addFeelingToNewEntry = (f: string) => {
    let newEntry = JSON.parse(localStorage.getItem('newEntry') || '{}');
    newEntry['feeling'] = f;
    newEntry['topics'] = [];
    localStorage.setItem('newEntry', JSON.stringify(newEntry));
}

export const addTopicToNewEntry = (t: string) => {
    let newEntry = JSON.parse(localStorage.getItem('newEntry') || '{}');
    if (newEntry['topics'].includes(t)) {
        newEntry['topics'] = newEntry['topics'].filter((topic: string) => topic !== t);
    } else {
        newEntry['topics'].push(t);
    }
    localStorage.setItem('newEntry', JSON.stringify(newEntry));
}

export const addDataToNewEntry = (title: string, date: string, content: string, place: string) => {
    let newEntry = JSON.parse(localStorage.getItem('newEntry') || '{}');
    newEntry['title'] = title;
    newEntry['date'] = date;
    newEntry['content'] = content;
    newEntry['place'] = place;
    localStorage.setItem('newEntry', JSON.stringify(newEntry));

    addNewEntry(newEntry);
}

export const updateEntry = (entry: Entry) => {
    const entries = JSON.parse(localStorage.getItem('entries') || '[]') as Entry[];
    const updatedEntries = entries.map(item => {
        if (item.id === entry.id) {
            return entry;
        }
        return item;
    });
    localStorage.setItem('entries', JSON.stringify(updatedEntries));
    setActualEntry(entry);
}


export const getTop3MoodsWithCounts = (): { mood: string, count: number }[] => {
    const entries = JSON.parse(localStorage.getItem('entries') || '[]') as Entry[];
    const moodCounts: { [mood: string]: number } = {};
    entries.forEach(entry => {
        const mood = entry.feeling;
        if (mood) {
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        }
    });

    const sortedMoodEntries = Object.entries(moodCounts)
        .map(([mood, count]) => ({ mood, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    return sortedMoodEntries;
}

export const getTop3TopicsWithCounts = (): { topic: string, count: number }[] => {
    const entries = JSON.parse(localStorage.getItem('entries') || '[]') as Entry[];
    const topicCounts: { [topic: string]: number } = {};
    entries.forEach(entry => {
        entry.topics.forEach(topic => {
            topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });
    });

    const sortedTopicEntries = Object.entries(topicCounts)
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    return sortedTopicEntries;
}



import { happy, sad, heart, home, paw, sunny, bandage, fitness, people } from 'ionicons/icons';

interface TopicIcons {
    [key: string]: string;
}

export const moodIcons: { [key: string]: string } = {
    "Happy": happy,
    "Unhappy": sad,
    "Neutral": sunny,
};

export const topicIcons: TopicIcons = {
    "Friends": people,
    "Love": heart,
    "Home": home,
    "Pet": paw,
    "Life": sunny,
    "Health": bandage,
    "Sport": fitness,
};


export const getActualMood = () => {
    return JSON.parse(localStorage.getItem('actualEntry') || '{}')['feeling'];
}



export const getLatestVersion = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    try {
        const response = await fetch("https://tommasocaputi.altervista.org/DearDiary/webhook.php", {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
                "command": "getLatestVersion"
            }),
            redirect: "follow"
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const res = await response.json();

        if (res.version === '2.2.2') {
            return false;
        } else {
            return res;
        }
    } catch (error) {
        throw error;
    }
};
