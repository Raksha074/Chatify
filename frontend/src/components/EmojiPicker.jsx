import { useState, useMemo } from "react";
import { SearchIcon, XIcon } from "lucide-react";

const EMOJI_DATA = [
  // smileys
  { emoji: "😀", cat: "smileys", name: "grinning happy smile face" },
  { emoji: "😃", cat: "smileys", name: "smiley happy grin face" },
  { emoji: "😄", cat: "smileys", name: "smile happy joy laugh" },
  { emoji: "😁", cat: "smileys", name: "beaming grin happy" },
  { emoji: "😆", cat: "smileys", name: "laugh lol haha chuckle" },
  { emoji: "😅", cat: "smileys", name: "sweat smile relief nervous" },
  { emoji: "😂", cat: "smileys", name: "joy tears laugh lol funny crying" },
  { emoji: "🤣", cat: "smileys", name: "rofl rolling laughing lol" },
  { emoji: "🥲", cat: "smileys", name: "smiling tear proud emotional" },
  { emoji: "☺️", cat: "smileys", name: "blush warm sweet shy smile" },
  { emoji: "😊", cat: "smileys", name: "smile blush cute happy" },
  { emoji: "😇", cat: "smileys", name: "angel halo innocent holy" },
  { emoji: "🙂", cat: "smileys", name: "slight smile" },
  { emoji: "🙃", cat: "smileys", name: "upside down silly sarcasm" },
  { emoji: "😉", cat: "smileys", name: "wink joke flirting" },
  { emoji: "😌", cat: "smileys", name: "relieved peaceful calm" },
  { emoji: "😍", cat: "smileys", name: "heart eyes love crush adore" },
  { emoji: "🥰", cat: "smileys", name: "in love smiling hearts warm" },
  { emoji: "😘", cat: "smileys", name: "kiss blow kiss love" },
  { emoji: "😋", cat: "smileys", name: "yum delicious tasty tongue" },
  { emoji: "😜", cat: "smileys", name: "winking tongue crazy party" },
  { emoji: "🤪", cat: "smileys", name: "zany crazy wild silly" },
  { emoji: "😎", cat: "smileys", name: "cool sunglasses swag boss" },
  { emoji: "🤓", cat: "smileys", name: "nerd geek glasses smart" },
  { emoji: "🥳", cat: "smileys", name: "party celebration birthday celebrate" },
  { emoji: "😏", cat: "smileys", name: "smirk sly cheeky flirty" },
  { emoji: "😒", cat: "smileys", name: "unamused annoyed meh" },
  { emoji: "😞", cat: "smileys", name: "disappointed sad down" },
  { emoji: "😔", cat: "smileys", name: "pensive sad regret sorrow" },
  { emoji: "😟", cat: "smileys", name: "worried anxious concern" },
  { emoji: "😕", cat: "smileys", name: "confused puzzled" },
  { emoji: "🙁", cat: "smileys", name: "slightly frowning sad" },
  { emoji: "🥺", cat: "smileys", name: "pleading begging puppy eyes cute" },
  { emoji: "😢", cat: "smileys", name: "crying tear sad hurt" },
  { emoji: "😭", cat: "smileys", name: "loudly crying bawling tears sad" },
  { emoji: "😤", cat: "smileys", name: "triumph huff angry proud" },
  { emoji: "😠", cat: "smileys", name: "angry mad annoyed" },
  { emoji: "😡", cat: "smileys", name: "pouting rage red angry mad" },
  { emoji: "🤬", cat: "smileys", name: "swearing curse angry mad symbols" },
  { emoji: "🤯", cat: "smileys", name: "mind blown exploding head shocked" },
  { emoji: "😳", cat: "smileys", name: "flushed embarrassed shocked blushed" },
  { emoji: "🥵", cat: "smileys", name: "hot sweating red heat" },
  { emoji: "🥶", cat: "smileys", name: "cold freezing ice frozen" },
  { emoji: "😱", cat: "smileys", name: "scream fear scared shocked horror" },
  { emoji: "😨", cat: "smileys", name: "fearful scared frightened" },
  { emoji: "😰", cat: "smileys", name: "anxious nervous cold sweat" },
  { emoji: "😥", cat: "smileys", name: "sad relieved sweat" },
  { emoji: "😓", cat: "smileys", name: "downcast sweat discouraged tired" },
  { emoji: "🤗", cat: "smileys", name: "hugging hug warm friendly" },
  { emoji: "🤔", cat: "smileys", name: "thinking wonder ponder hmm" },
  { emoji: "🤭", cat: "smileys", name: "giggle hand over mouth oops" },
  { emoji: "🤫", cat: "smileys", name: "shh quiet silence secret" },
  { emoji: "🤥", cat: "smileys", name: "lying pinocchio liar" },
  { emoji: "😶", cat: "smileys", name: "no mouth silent mute" },
  { emoji: "😐", cat: "smileys", name: "neutral poker face blank" },
  { emoji: "😑", cat: "smileys", name: "expressionless deadpan" },
  { emoji: "😬", cat: "smileys", name: "grimacing awkward yikes cringe" },
  { emoji: "🙄", cat: "smileys", name: "eye roll whatever annoyed" },
  { emoji: "😯", cat: "smileys", name: "hushed surprised whoa" },
  { emoji: "😮", cat: "smileys", name: "open mouth wow surprise" },
  { emoji: "😲", cat: "smileys", name: "astonished amazed shocked" },
  { emoji: "🥱", cat: "smileys", name: "yawn bored sleepy tired" },
  { emoji: "😴", cat: "smileys", name: "sleeping zzz tired rest" },
  { emoji: "🤤", cat: "smileys", name: "drooling hungry crave sleep" },
  { emoji: "😵", cat: "smileys", name: "dizzy knocked out dead eyes" },
  { emoji: "🤐", cat: "smileys", name: "zipper mouth secret shut" },
  { emoji: "🥴", cat: "smileys", name: "woozy drunk tipsy silly" },
  { emoji: "🤢", cat: "smileys", name: "nauseated sick gross green" },
  { emoji: "🤮", cat: "smileys", name: "vomiting puke throw up barf" },
  { emoji: "🤧", cat: "smileys", name: "sneezing sick tissue cold" },
  { emoji: "😷", cat: "smileys", name: "mask sick doctor covid virus" },

  // gestures
  { emoji: "👋", cat: "gestures", name: "wave hello bye greeting" },
  { emoji: "🤚", cat: "gestures", name: "raised back of hand stop" },
  { emoji: "🖐️", cat: "gestures", name: "hand splayed five fingers" },
  { emoji: "✋", cat: "gestures", name: "raised hand high five stop" },
  { emoji: "🖖", cat: "gestures", name: "vulcan salute spock live long" },
  { emoji: "👌", cat: "gestures", name: "ok perfect good nice" },
  { emoji: "🤌", cat: "gestures", name: "pinched fingers italian what you want" },
  { emoji: "🤏", cat: "gestures", name: "pinching hand tiny little bit small" },
  { emoji: "✌️", cat: "gestures", name: "peace victory two fingers" },
  { emoji: "🤞", cat: "gestures", name: "crossed fingers luck hope wish" },
  { emoji: "🤟", cat: "gestures", name: "love you gesture sign language" },
  { emoji: "🤘", cat: "gestures", name: "rock on metal horns" },
  { emoji: "🤙", cat: "gestures", name: "call me shaka hang loose" },
  { emoji: "👈", cat: "gestures", name: "pointing left finger point" },
  { emoji: "👉", cat: "gestures", name: "pointing right finger point" },
  { emoji: "👆", cat: "gestures", name: "pointing up finger" },
  { emoji: "👇", cat: "gestures", name: "pointing down finger" },
  { emoji: "☝️", cat: "gestures", name: "point up index one" },
  { emoji: "👍", cat: "gestures", name: "thumbs up like good agree yes" },
  { emoji: "👎", cat: "gestures", name: "thumbs down dislike bad disagree no" },
  { emoji: "✊", cat: "gestures", name: "raised fist solidarity power" },
  { emoji: "👊", cat: "gestures", name: "fist bump punch hit" },
  { emoji: "🤛", cat: "gestures", name: "fist left bump" },
  { emoji: "🤜", cat: "gestures", name: "fist right bump" },
  { emoji: "👏", cat: "gestures", name: "clapping clap applause bravo kudos" },
  { emoji: "🙌", cat: "gestures", name: "raising hands praise hooray celebration" },
  { emoji: "👐", cat: "gestures", name: "open hands hug" },
  { emoji: "🤲", cat: "gestures", name: "palms up prayer dua open" },
  { emoji: "🤝", cat: "gestures", name: "handshake deal agreement partnership" },
  { emoji: "🙏", cat: "gestures", name: "praying hands namaste please thank you pray" },
  { emoji: "✍️", cat: "gestures", name: "writing hand pen signature" },
  { emoji: "💪", cat: "gestures", name: "flexed biceps muscle strong power gym" },
  { emoji: "👀", cat: "gestures", name: "eyes looking see watch peep" },

  // hearts
  { emoji: "❤️", cat: "hearts", name: "red heart love romance passion" },
  { emoji: "🧡", cat: "hearts", name: "orange heart warm love" },
  { emoji: "💛", cat: "hearts", name: "yellow heart friendship loyalty" },
  { emoji: "💚", cat: "hearts", name: "green heart nature envy" },
  { emoji: "💙", cat: "hearts", name: "blue heart trust peace cold" },
  { emoji: "💜", cat: "hearts", name: "purple heart royalty magic" },
  { emoji: "🖤", cat: "hearts", name: "black heart dark gothic sorrow" },
  { emoji: "🤍", cat: "hearts", name: "white heart pure clean" },
  { emoji: "🤎", cat: "hearts", name: "brown heart earth chocolate" },
  { emoji: "💔", cat: "hearts", name: "broken heart heartbreak hurt sad" },
  { emoji: "❣️", cat: "hearts", name: "heart exclamation mark love" },
  { emoji: "💕", cat: "hearts", name: "two hearts floating pink love" },
  { emoji: "💞", cat: "hearts", name: "revolving hearts revolving pink" },
  { emoji: "💓", cat: "hearts", name: "beating heart vibrating pulse" },
  { emoji: "💗", cat: "hearts", name: "growing heart pink love" },
  { emoji: "💖", cat: "hearts", name: "sparkling heart sparkle shiny" },
  { emoji: "💘", cat: "hearts", name: "cupid arrow heart love romance" },
  { emoji: "💝", cat: "hearts", name: "heart with ribbon gift present" },
  { emoji: "🔥", cat: "hearts", name: "fire flame lit hot trend burn" },
  { emoji: "✨", cat: "hearts", name: "sparkles shiny magical stars clean glitter" },
  { emoji: "⭐", cat: "hearts", name: "star shiny gold rating favorite" },
  { emoji: "🌟", cat: "hearts", name: "glowing star bright shining" },
  { emoji: "💫", cat: "hearts", name: "dizzy star shooting sparkle" },
  { emoji: "⚡", cat: "hearts", name: "high voltage lightning bolt thunder electric power fast" },
  { emoji: "💥", cat: "hearts", name: "collision boom explosion bang pow" },
  { emoji: "💯", cat: "hearts", name: "hundred points perfect score 100 legit" },
  { emoji: "🎉", cat: "hearts", name: "party popper celebration celebrate tada confetti" },
  { emoji: "🎊", cat: "hearts", name: "confetti ball party celebration" },
  { emoji: "🎈", cat: "hearts", name: "balloon birthday party celebration" },
  { emoji: "🎂", cat: "hearts", name: "birthday cake celebration anniversary" },
  { emoji: "🎁", cat: "hearts", name: "wrapped gift present birthday surprise" },
  { emoji: "🏆", cat: "hearts", name: "trophy winner first champion award" },

  // objects
  { emoji: "⚽", cat: "objects", name: "soccer football ball game sport" },
  { emoji: "🏀", cat: "objects", name: "basketball ball hoop sport" },
  { emoji: "🎮", cat: "objects", name: "video game controller gaming play" },
  { emoji: "🕹️", cat: "objects", name: "joystick arcade retro game" },
  { emoji: "🎲", cat: "objects", name: "game die dice luck random casino" },
  { emoji: "🎯", cat: "objects", name: "direct hit bullseye target goal dart" },
  { emoji: "🎨", cat: "objects", name: "artist palette paint colors art draw" },
  { emoji: "🎤", cat: "objects", name: "microphone mic sing karaoke music" },
  { emoji: "🎧", cat: "objects", name: "headphones audio music listening earphone" },
  { emoji: "🎼", cat: "objects", name: "musical score notes sheet song" },
  { emoji: "🎹", cat: "objects", name: "musical keyboard piano keys music" },
  { emoji: "🎸", cat: "objects", name: "guitar rock instrument music acoustic" },
  { emoji: "📱", cat: "objects", name: "mobile phone smartphone iphone cell call" },
  { emoji: "💻", cat: "objects", name: "laptop computer macbook pc tech code" },
  { emoji: "💡", cat: "objects", name: "light bulb idea smart bright electricity" },
  { emoji: "🚀", cat: "objects", name: "rocket ship blast off space launch fast moon" },

  // food & nature
  { emoji: "🍕", cat: "food", name: "pizza slice cheese italian food" },
  { emoji: "🍔", cat: "food", name: "hamburger burger fast food patty" },
  { emoji: "🍟", cat: "food", name: "french fries fast food potato chips" },
  { emoji: "🌭", cat: "food", name: "hot dog sausage bun food" },
  { emoji: "🍿", cat: "food", name: "popcorn cinema movie snack" },
  { emoji: "🍳", cat: "food", name: "cooking egg fry pan breakfast" },
  { emoji: "🥪", cat: "food", name: "sandwich bread lunch food" },
  { emoji: "🍜", cat: "food", name: "steaming bowl ramen noodles soup pasta" },
  { emoji: "🍣", cat: "food", name: "sushi japanese fish rice food" },
  { emoji: "🍦", cat: "food", name: "soft ice cream cone dessert sweet cold" },
  { emoji: "🍩", cat: "food", name: "doughnut donut sweet dessert pastry glaze" },
  { emoji: "🍫", cat: "food", name: "chocolate bar candy sweet treat" },
  { emoji: "☕", cat: "food", name: "hot beverage coffee tea cup mug espresso cafe" },
  { emoji: "🧃", cat: "food", name: "beverage box juice straw drink" },
  { emoji: "🍺", cat: "food", name: "beer mug drink alcohol cheers lager" },
  { emoji: "🍻", cat: "food", name: "clinking beer mugs cheers toast celebration" },
  { emoji: "🐶", cat: "food", name: "dog face puppy pet animal canine bark" },
  { emoji: "🐱", cat: "food", name: "cat face kitten kitty pet feline meow" },
  { emoji: "🐼", cat: "food", name: "panda face bear cute animal bamboo" },
  { emoji: "🦁", cat: "food", name: "lion face wild animal king roar cat" },
  { emoji: "🌸", cat: "food", name: "cherry blossom sakura pink flower spring floral" },
  { emoji: "🌹", cat: "food", name: "rose red flower romance love valentines floral" },
  { emoji: "🌻", cat: "food", name: "sunflower yellow flower summer floral" },
  { emoji: "🌈", cat: "food", name: "rainbow sky weather colors pride" },
  { emoji: "☀️", cat: "food", name: "sun sunny summer bright heat day weather" },
  { emoji: "🌙", cat: "food", name: "crescent moon night evening sleep dark" },
];

const CATEGORIES = [
  { id: "smileys", name: "Smileys", icon: "😀" },
  { id: "gestures", name: "Gestures", icon: "👋" },
  { id: "hearts", name: "Hearts", icon: "❤️" },
  { id: "objects", name: "Objects", icon: "🎮" },
  { id: "food", name: "Food & Nature", icon: "🍕" },
];

function EmojiPicker({ onSelectEmoji, onClose }) {
  const [activeTab, setActiveTab] = useState("smileys");
  const [search, setSearch] = useState("");

  const displayEmojis = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (query) {
      return EMOJI_DATA.filter(
        (item) => item.name.includes(query) || item.emoji.includes(query)
      ).map((item) => item.emoji);
    }
    return EMOJI_DATA.filter((item) => item.cat === activeTab).map((item) => item.emoji);
  }, [search, activeTab]);

  return (
    <div
      style={{
        backgroundColor: "var(--modal-bg)",
        borderColor: "var(--border-color)",
      }}
      className="w-80 sm:w-96 max-h-[380px] flex flex-col rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150"
    >
      {/* HEADER & SEARCH BAR */}
      <div className="p-3 border-b border-slate-700/30 flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search emoji (e.g. smile, love, fire, dog)..."
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-slate-800/30 dark:bg-slate-700/30 border border-slate-700/40 focus:outline-none focus:border-cyan-500 text-slate-200 placeholder-slate-400"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-700/30 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          title="Close emoji picker"
        >
          <XIcon className="size-4" />
        </button>
      </div>

      {/* CATEGORY TABS (Hidden when searching) */}
      {!search && (
        <div className="flex border-b border-slate-700/20 px-2 py-1.5 gap-1 bg-slate-900/20">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              title={cat.name}
              className={`flex-1 py-1 text-base rounded-lg transition-all cursor-pointer ${
                activeTab === cat.id
                  ? "bg-cyan-500/25 scale-110 shadow-sm ring-1 ring-cyan-500/40"
                  : "opacity-60 hover:opacity-100 hover:bg-slate-800/20"
              }`}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      )}

      {/* EMOJI GRID */}
      <div className="flex-1 overflow-y-auto p-3 max-h-60 grid grid-cols-7 sm:grid-cols-8 gap-1.5 text-2xl select-none">
        {displayEmojis.length > 0 ? (
          displayEmojis.map((emoji, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => onSelectEmoji(emoji)}
              className="hover:scale-125 transition-transform p-1 rounded-lg hover:bg-cyan-500/20 flex items-center justify-center cursor-pointer active:scale-95"
            >
              {emoji}
            </button>
          ))
        ) : (
          <div className="col-span-8 py-8 text-center text-xs text-slate-400">
            No emojis found for "{search}"
          </div>
        )}
      </div>

      <div className="p-2 border-t border-slate-700/20 text-center text-[10px] text-slate-400 bg-slate-900/10">
        Click emoji to add to message
      </div>
    </div>
  );
}

export default EmojiPicker;
