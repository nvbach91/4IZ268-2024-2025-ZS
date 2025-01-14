function getUrlParameter(name) {
	name = name.replace(/[\[\]]/g, "\\$&");
	const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
	const results = regex.exec(window.location.href);
	if (!results) return null;
	if (!results[2]) return "";
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function convertToSpace(text) {
	return text.replace(/-/g, " ");
}

const quotes = [
	"<i>I hated every minute of training, but I said, Don't quit. Suffer now and live the rest of your life as a champion.” </i><br/> Muhammad Ali",
	"<i>We are what we repeatedly do. Excellence then is not an act but a habit. </i><br/>Aristotle",
	"<i>The body achieves what the mind believes. </i><br/> Napoleon Hill",
	"<i>The hard days are the best because that's when champions are made, so if you push through, you can push through anything. </i><br/> Dana Vollmer",
	"<i>If you don't find the time, if you don't do the work, you don't get the results. </i><br/> Arnold Schwarzenegger",
	"<i>Dead last finish is greater than did not finish, which trumps did not start. </i><br/> Unknown",
	"<i>Push harder than yesterday if you want a different tomorrow. </i><br/> Vincent Williams Sr.",
	"<i>The real workout starts when you want to stop. </i><br/> Ronnie Coleman",
	"<i>Take care of your body. It's the only place you have to live. </i><br/> Jim Rohn",
	"<i>I've failed over and over again in my life and that is why I succeed. </i><br/> Michael Jordan",
	"<i>Once you are exercising regularly, the hardest thing is to stop it. </i><br/> Erin Gray",
	"<i>The secret of getting ahead is getting started. </i><br/> Mark Twain",
	"<i>Exercise should be regarded as tribute to the heart. </i><br/> Gene Tunney",
	"<i>You're going to have to let it hurt. Let it suck. The harder you work, the better you will look. Your appearance isn't parallel to how heavy you lift, it's parallel to how hard you work. </i><br/>Joe Manganiello",
	"<i>Most people fail, not because of lack of desire, but, because of lack of commitment. </i><br/>Vince Lombardi",
	"<i>You miss one hundred percent of the shots you don't take. </i><br/> Wayne Gretzky",
	"<i>If something stands between you and your success, move it. Never be denied. </i><br/> Dwayne 'The Rock' Johnson",
	"<i>All progress takes place outside the comfort zone. </i><br/> Michael John Bobak",
	"<i>Just believe in yourself. Even if you don't, just pretend that you do and at some point, you will. </i><br/> Venus Williams",
	"<i>The harder you work and the more prepared you are for something, you're going to be able to persevere through anything. </i><br/> Carli Lloyd",
	"<i>Enduring means accepting. Accepting things as they are and not as you would wish them to be, and then looking ahead, not behind. </i><br/> Rafael Nadal",
	"<i>If you want something you've never had, you must be willing to do something you've never done. </i><br/> Thomas Jefferson",
	"<i>The resistance that you fight physically in the gym and the resistance that you fight in life can only build a strong character. </i><br/> Arnold Schwarzenegger",
	"<i>Continuous improvement is better than delayed perfection. </i><br/> Mark Twain",
	"<i>Once you learn to quit, it becomes a habit. </i><br/> Vince Lombardi",
	"<i>It's hard to beat a person who never gives up. </i><br/> Babe Ruth",
	"<i>Do something today that your future self will thank you for. </i><br/> Sean Patrick Flanery",
	"<i>Success is usually the culmination of controlling failure. </i><br/> Sylvester Stallone",
	"<i>Think of your workouts as important meetings you schedule with yourself. Bosses don't cancel. </i><br/> Unknown",
	"<i>Workout till you feel that pain and soreness in muscles. This one is good pain. No pain, no gain. </i><br/> Invajy",
	"<i>Confidence comes from discipline and training. </i><br/> Robert Kiyosaki",
	"<i>I don't count my sit-ups. I only start counting when it starts hurting because they're the only ones that count. </i><br/> Muhammad Ali",
	"<i>What hurts today makes you stronger tomorrow. </i><br/> Jay Cutler",
	"<i>Strength does not come from physical capacity. It comes from an indomitable will. </i><br/> Mahatma Gandhi",
	"<i>You must expect things of yourself before you can do them. </i><br/> Michael Jordan",
	"<i>The last three or four reps is what makes the muscle grow. This area of pain divides a champion from someone who is not a champion. </i><br/> Arnold Schwarzenegger",
	"<i>If you fail to prepare, you're prepared to fail. </i><br/> Mark Spitz",
	"<i>Motivation is what gets you started. Habit is what keeps you going. </i><br/> Jim Ryun",
	"<i>A champion is someone who gets up when they can't. </i><br/> Jack Dempsey",
	"<i>The difference between the impossible and the possible lies in a person's determination. </i><br/> Tommy Lasorda",
	"<i>When you have a clear vision of your goal, it's easier to take the first step toward it. </i><br/> LL Cool J",
];
