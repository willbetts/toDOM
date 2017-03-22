document.addEventListener("DOMContentLoaded", () => {
  const button = $l("button");
  $l(".add-todo").on("click", addTodo);
});

function addTodo() {
    $l("ul").append(
    `<li>${$l(".get-text").htmlElements[0].value} <button class="remove-button">remove Todo</button> </li>`);
    $l(".remove-button").on("click", removeTodo);
    $l(".get-text").empty();
}

function removeTodo(event) {
  $l(event.currentTarget).parent().remove();
}
