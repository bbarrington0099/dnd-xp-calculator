import { useState, useEffect } from 'react';
import { Users, Plus, Minus, Info, Scroll, Swords, Shield, Star, BookOpen, Heart, Zap, Mountain, AlertTriangle, Crown, CloudLightning } from 'lucide-react';
import './App.css';

const DnDXPCalculator = () => {
  const [numPlayers, setNumPlayers] = useState(4);
  const [sharedPartyLevel, setSharedPartyLevel] = useState(true);
  const [partyLevel, setPartyLevel] = useState(1);
  const [characters, setCharacters] = useState([
    { name: 'Character 1', level: 1, totalXP: 0 }
  ]);
  const [customModifiers, setCustomModifiers] = useState([]);
  const [sessionEvents, setSessionEvents] = useState({
    sessionEnd: false,
    encounters: false,
    shortTermGoal: false,
    attunedItem: false,
    bondIdealFlaw: false,
    relationship: false,
    loreDiscovery: false,
    skillSpellSolution: false,
    perilousJourney: false,
    significantFailure: false,
    majorImpact: false,
    piety: false
  });
  const [eventCounts, setEventCounts] = useState({
    attunedItem: 1,
    bondIdealFlaw: 1,
    relationship: 1,
    loreDiscovery: 1,
    skillSpellSolution: 1,
    perilousJourney: 1,
    significantFailure: 1,
    majorImpact: 1,
    piety: 1
  });
  const [encounterXP, setEncounterXP] = useState(0);

  // Initialize characters when numPlayers changes
  useEffect(() => {
    if (!sharedPartyLevel) {
      const newCharacters = [];
      for (let i = 0; i < numPlayers; i++) {
        newCharacters.push({
          name: characters[i]?.name || `Character ${i + 1}`,
          level: characters[i]?.level || 1,
          totalXP: characters[i]?.totalXP || 0
        });
      }
      setCharacters(newCharacters);
    }
  }, [numPlayers, sharedPartyLevel]);

  useEffect(() => {
    if (eventCounts.piety > numPlayers) {
      setEventCounts(prev => ({ ...prev, piety: numPlayers }));
    }
  }, [numPlayers]);

  const addCharacter = () => {
    if (characters.length < 20) {
      setCharacters([...characters, { 
        name: `Character ${characters.length + 1}`, 
        level: 1, 
        totalXP: 0 
      }]);
      setNumPlayers(numPlayers + 1);
    }
  };

  const removeCharacter = (index) => {
    if (characters.length > 1) {
      setCharacters(characters.filter((_, i) => i !== index));
    }
    setNumPlayers(numPlayers - 1);
  };

  const updateCharacter = (index, field, value) => {
    const updated = [...characters];
    updated[index][field] = value;
    setCharacters(updated);
  };

  const addCustomModifier = () => {
    setCustomModifiers([...customModifiers, { description: '', multiplier: 1, count: 1 }]);
  };

  const removeCustomModifier = (index) => {
    setCustomModifiers(customModifiers.filter((_, i) => i !== index));
  };

  const updateCustomModifier = (index, field, value) => {
    const updated = [...customModifiers];
    updated[index][field] = value;
    setCustomModifiers(updated);
  };

  const updateEventCount = (event, count) => {
    const clampedCount = event === 'piety' ? Math.min(numPlayers, Math.max(1, count)) : Math.max(1, count);
    setEventCounts({...eventCounts, [event]: clampedCount});
  };

  const calculateXP = () => {
    let totalXP = 0;
    const level = sharedPartyLevel ? partyLevel : 1; // Will be calculated per character if individual
    const actualPartySize = sharedPartyLevel ? numPlayers : characters.length;

    if (sharedPartyLevel) {
      // Session end XP
      if (sessionEvents.sessionEnd) totalXP += level * 100;
      
      // Encounter XP
      if (sessionEvents.encounters) totalXP += encounterXP;
      
      // Short-term goal XP
      if (sessionEvents.shortTermGoal) totalXP += level * 200;
      
      // Conditional XP (25 * level each)
      const conditionalEvents = [
        'attunedItem', 'bondIdealFlaw', 'relationship', 'loreDiscovery',
        'skillSpellSolution', 'perilousJourney', 'significantFailure', 'majorImpact', 'piety'
      ];
      
      conditionalEvents.forEach(event => {
        if (sessionEvents[event]) {
          const count = eventCounts[event] || 1;
          totalXP += level * 25 * count;
        }
      });
      
      // Custom modifiers
      customModifiers.forEach(mod => {
        if (mod.description && mod.multiplier > 0) {
          const count = mod.count || 1;
          totalXP += level * mod.multiplier * count;
        }
      });
      
      const xpPerPlayer = Math.floor(totalXP / actualPartySize);
      return { totalXP, xpPerPlayer, isShared: true, partySize: actualPartySize };
    } else {
      // Individual character XP calculation
      const characterXP = characters.map(char => {
        let charXP = 0;
        
        // Session end XP
        if (sessionEvents.sessionEnd) charXP += char.level * 100;
        
        // Encounter XP
        if (sessionEvents.encounters) charXP += encounterXP;
        
        // Short-term goal XP
        if (sessionEvents.shortTermGoal) charXP += char.level * 200;
        
        // Conditional XP
        const conditionalEvents = [
          'attunedItem', 'bondIdealFlaw', 'relationship', 'loreDiscovery',
          'skillSpellSolution', 'perilousJourney', 'significantFailure', 'majorImpact', 'piety'
        ];
        
        conditionalEvents.forEach(event => {
          if (sessionEvents[event]) {
            const count = eventCounts[event] || 1;
            charXP += char.level * 25 * count;
          }
        });
        
        // Custom modifiers
        customModifiers.forEach(mod => {
          if (mod.description && mod.multiplier > 0) {
            const count = mod.count || 1;
            charXP += char.level * mod.multiplier * count;
          }
        });
        
        return {
          name: char.name,
          level: char.level,
          xp: Math.floor(charXP / actualPartySize),
          totalXP: char.totalXP + Math.floor(charXP / actualPartySize)
        };
      });
      
      return { characterXP, isShared: false, partySize: actualPartySize };
    }
  };

  const results = calculateXP();

  const eventDescriptions = [
    { key: 'sessionEnd', icon: <Scroll className="w-4 h-4" />, text: 'Session completed (Level × 100 XP)', multiplier: 100, allowMultiple: false },
    { key: 'encounters', icon: <Swords className="w-4 h-4" />, text: 'Encounters overcome (DM determined XP)', isCustom: true, allowMultiple: false },
    { key: 'shortTermGoal', icon: <Star className="w-4 h-4" />, text: 'Short-term goal completed by at least one character per session (Level × 200 XP)', multiplier: 200, allowMultiple: false },
    { key: 'attunedItem', icon: <Shield className="w-4 h-4" />, text: 'Character attuned to a new magic item (Level × 25 XP)', multiplier: 25, allowMultiple: true },
    { key: 'bondIdealFlaw', icon: <Heart className="w-4 h-4" />, text: 'Character invoked their Bond, Ideal or Flaw to make a meaningful impact during gameplay (Level × 25 XP)', multiplier: 25, allowMultiple: true },
    { key: 'relationship', icon: <Users className="w-4 h-4" />, text: 'Character developed a new or existing relationship in a meaningful way (NPC or PC) (Level × 25 XP)', multiplier: 25, allowMultiple: true },
    { key: 'loreDiscovery', icon: <BookOpen className="w-4 h-4" />, text: 'Character discovered a piece of interesting, useful and/or secret lore about the world or an NPC (Level × 25 XP)', multiplier: 25, allowMultiple: true },
    { key: 'skillSpellSolution', icon: <Zap className="w-4 h-4" />, text: 'Character used a skill or spell to solve a problem in an interesting or meaningful way (Level × 25 XP)', multiplier: 25, allowMultiple: true },
    { key: 'perilousJourney', icon: <Mountain className="w-4 h-4" />, text: 'The party undertook a perilous journey that took time to complete (Level × 25 XP)', multiplier: 25, allowMultiple: true },
    { key: 'significantFailure', icon: <AlertTriangle className="w-4 h-4" />, text: 'Character failed a significant roll that resulted in wasted resources, a negative relationship with an NPC, an injury or some other major drawback (Level × 25 XP)', multiplier: 25, allowMultiple: true },
    { key: 'majorImpact', icon: <Crown className="w-4 h-4" />, text: 'Character took actions that made a major impact in the world, or local area - For better or worse (Level × 25 XP)', multiplier: 25, allowMultiple: true },
    { key: 'piety', icon: <CloudLightning className="w-4 h-4" />, text:'Character increased piety level - Max XP gain is 1 per character regardless of how many Piety Points they recieved (Level × 25)', multiplier: 25, allowMultiple: true }
  ];

  return (
    <div className="app-container">
      <div className="main-content">
        {/* Header */}
        <div className="header-section">
          <h1 className="app-title">
            <Scroll className="header-icon" />
            Our Experienced Party
            <Scroll className="header-icon" />
          </h1>
          <p className="app-subtitle">A D&D 5e Custom Experience System</p>
        </div>

        {/* Description */}
        <div className="description-box">
          <div className="flex-start">
            <BookOpen className="description-icon" />
            <div>
              <h3 className="description-heading">Session's End Discussion</h3>
              <p className="description-text">
                At the conclusion of each adventure, gather your party to calculate Experience Points earned through this sacred checklist. 
                This should be a collaborative discussion, with the Dungeon Master guiding players to explain their reasoning and 
                justify their achievements. Adventurers should remain honest and fair, remembering that Experience Points represent 
                their characters' growth and development throughout their journey. When uncertainty arises about whether conditions 
                were met, let the wisdom of the group majority guide your decision.
              </p>
              <hr />
              <p>
                The point of this system is for the party to grow together. Our achievements are your achievements, as we share our stories, we share out experiences. It is recommended to use this system with a 'Shared Party Level', meaning all characters get the same XP; but it can be used with different level characters, keeping in mind that the higher the level, the greater the divide between you and your allies will grow.
              </p>
            </div>
          </div>
        </div>

        {/* Party Setup */}
        <div className="config-section">
          <h2 className="section-title">
            <Users className="section-icon" />
            Party Configuration
          </h2>
          
          <div className="config-grid">
            {sharedPartyLevel && (
              <div className="input-group">
                <label className="input-label">Number of Players</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={numPlayers}
                  onChange={(e) => setNumPlayers(parseInt(e.target.value) || 1)}
                  className="number-input"
                />
              </div>
            )}
            
            <div className="input-group">
              <label className="input-label flex-center">
                Shared Party Level
                <div className="info-tooltip">
                  <Info className="info-icon" />
                  <span className="tooltip-text">All party members are the same level with same XP</span>
                </div>
              </label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={sharedPartyLevel}
                  onChange={(e) => setSharedPartyLevel(e.target.checked)}
                  className="toggle-input"
                />
                <div className={`toggle-track ${sharedPartyLevel ? 'toggle-on' : ''}`}>
                  <div className={`toggle-handle ${sharedPartyLevel ? 'toggle-handle-on' : ''}`} />
                </div>
                <span className="toggle-label">{sharedPartyLevel ? 'Enabled' : 'Disabled'}</span>
              </label>
            </div>
          </div>

          {/* Party Level or Individual Characters */}
          {sharedPartyLevel ? (
            <div className="party-level-group">
              <label className="input-label">Party Level</label>
              <input
                type="number"
                min="1"
                max="20"
                value={partyLevel}
                onChange={(e) => setPartyLevel(parseInt(e.target.value) || 1)}
                className="level-input"
              />
            </div>
          ) : (
            <div className="characters-section">
              <div className="characters-header">
                <h3 className="subsection-title">Individual Characters</h3>
                <div className="button-group">
                  <button
                    onClick={addCharacter}
                    disabled={characters.length >= 20}
                    className="add-button"
                  >
                    <Plus className="button-icon" />
                    Add
                  </button>
                </div>
              </div>
              
              <div className="characters-grid">
                {characters.map((char, index) => (
                  <div key={index} className="character-row">
                    <div className="character-name-input">
                      <input
                        type="text"
                        value={char.name}
                        onChange={(e) => updateCharacter(index, 'name', e.target.value)}
                        placeholder="Character name"
                        className="text-input"
                      />
                    </div>
                    <div className="character-level-input">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={char.level}
                        onChange={(e) => updateCharacter(index, 'level', parseInt(e.target.value) || 1)}
                        className="number-input"
                      />
                    </div>
                    <button
                      onClick={() => removeCharacter(index)}
                      disabled={characters.length <= 1}
                      className="remove-button"
                    >
                      <Minus className="button-icon" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Session Events */}
        <div className="events-section">
          <h2 className="section-title">
            <Star className="section-icon" />
            Session Events
          </h2>
          <p className="description-text">
            If any party member achieved any of the following, the box for that event should be checked, if multiple characters completed the same event, or one character met the requirements multiple times, increase the event's count. 
          </p>
          <hr />
          <p>
            The exceptions to this are 'Session completed' or 'Short-term goal completed' which can only be achieved once per session, and 'Encounters overcome' which is the total XP of the encounters that took place in the session determined by the DM.
          </p>
          
          <div className="events-list">
            {eventDescriptions.map((event) => (
              <div key={event.key} className="event-row">
                <div className="event-content">
                  <div className="event-icon">
                    {event.icon}
                  </div>
                  <div className="event-text">
                    <label className="event-label">
                      <input
                        type="checkbox"
                        checked={sessionEvents[event.key]}
                        onChange={(e) => setSessionEvents({...sessionEvents, [event.key]: e.target.checked})}
                        className="event-checkbox"
                      />
                      <span className="event-description">{event.text}</span>
                    </label>
                  </div>
                  {event.key === 'encounters' && sessionEvents.encounters && (
                    <div className="encounter-input">
                      <input
                        type="number"
                        min="0"
                        value={encounterXP}
                        onChange={(e) => setEncounterXP(parseInt(e.target.value) || 0)}
                        placeholder="XP Amount"
                        className="xp-input"
                      />
                    </div>
                  )}
                  {event.allowMultiple && sessionEvents[event.key] && (
                    <div className="event-counter">
                      <span className="counter-label">Count:</span>
                      <input
                        type="number"
                        min="1"
                        max={event.key === "piety" ? numPlayers : null}
                        value={eventCounts[event.key]}
                        onChange={(e) => updateEventCount(event.key, parseInt(e.target.value) || 1)}
                        className="count-input"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Modifiers */}
        <div className="modifiers-section">
          <div className="modifiers-header">
            <h2 className="section-title">
              <Zap className="section-icon" />
              Custom Modifiers
            </h2>
            <button
              onClick={addCustomModifier}
              className="add-button purple"
            >
              <Plus className="button-icon" />
              Add Custom
            </button>
          </div>
          
          {customModifiers.length > 0 && (
            <div className="modifiers-list">
              {customModifiers.map((modifier, index) => (
                <div key={index} className="modifier-row">
                  <div className="modifier-content">
                    <div className="modifier-input">
                      <input
                        type="text"
                        value={modifier.description}
                        onChange={(e) => updateCustomModifier(index, 'description', e.target.value)}
                        placeholder="Describe the achievement..."
                        className="text-input purple"
                      />
                    </div>
                    <button
                      onClick={() => removeCustomModifier(index)}
                      className="remove-button"
                    >
                      <Minus className="button-icon" />
                    </button>
                  </div>
                  <div className="modifier-settings">
                    <div className="modifier-setting">
                      <span className="setting-label">Multiplier:</span>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={modifier.multiplier}
                        onChange={(e) => updateCustomModifier(index, 'multiplier', parseFloat(e.target.value) || 0)}
                        className="multiplier-input"
                      />
                      <span className="setting-label">× Level</span>
                    </div>
                    <div className="modifier-setting">
                      <span className="setting-label">Count:</span>
                      <input
                        type="number"
                        min="1"
                        value={modifier.count || 1}
                        onChange={(e) => updateCustomModifier(index, 'count', parseInt(e.target.value) || 1)}
                        className="count-input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="results-section">
          <h2 className="section-title">
            <Crown className="section-icon" />
            Experience Points Earned
          </h2>
          
          {results.isShared ? (
            <div className="shared-results">
              <div className="xp-value">
                {results.xpPerPlayer} XP
              </div>
              <div className="xp-label">per party member</div>
              <div className="xp-calculation">
                Total XP: {results.totalXP} ÷ {results.partySize} players = {results.xpPerPlayer} XP each
              </div>
            </div>
          ) : (
            <div className="individual-results">
              <div className="results-header">
                <div className="results-description">
                  Total XP divided among {results.partySize} party members
                </div>
              </div>
              {results.characterXP.map((char, index) => (
                <div key={index} className="character-result">
                  <div className="character-info">
                    <div className="character-name">{char.name}</div>
                    <div className="character-level">Level {char.level}</div>
                  </div>
                  <div className="character-xp">
                    <div className="xp-gained">+{char.xp} XP</div>
                    <div className="xp-total">Total: {char.totalXP} XP</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DnDXPCalculator;