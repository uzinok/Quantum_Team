document.addEventListener('DOMContentLoaded', function() {

	// получаем поле ввода и вспомогательный блок
	let textarea = document.querySelector(".js-textarea");
	let block = document.querySelector(".for-textarea");

	// при нажатии на клавишу
	textarea.addEventListener("input", function() {

		// получаем значение поля ввода
		let val_text = textarea.value;

		// c помощью регулярных выражений заменм некоторые символы
		val_text = val_text.replace(/ /g, "&nbsp;");
		val_text = val_text.replace(/<|>/g, "_");
		val_text = val_text.replace(/\n/g, "<br>");
		val_text = val_text.replace(/\r/g, "<br>");

		// полученное выражение добавим в вспомогательный блок
		block.innerHTML = val_text;

		console.log(block.offsetHeight);
		// получаем высоту вспомогательного блока
		let height_textarea = block.offsetHeight;

		// задаем высоту для текстового поля
		textarea.style.height = height_textarea + "px";
	})
})
