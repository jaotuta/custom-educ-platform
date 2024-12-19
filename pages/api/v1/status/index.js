function status(request, response) {
  response.status(200).json({ ok: "ok" });
}

export default status;
