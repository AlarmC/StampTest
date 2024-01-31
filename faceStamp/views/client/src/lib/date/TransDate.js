export const transMonth = (props) => {
	let value = props;
	let data;
	switch (value) {
		case "Jan":
			return (data = "01");
		case "Feb":
			return (data = "02");
		case "Mar":
			return (data = "03");
		case "Apr":
			return (data = "04");
		case "May":
			return (data = "05");
		case "Jun":
			return (data = "06");
		case "Jul":
			return (data = "07");
		case "Aug":
			return (data = "08");
		case "Sep":
			return (data = "09");
		case "Oct":
			return (data = "10");
		case "Nov":
			return (data = "11");
		case "Dec":
			return (data = "12");
	}
	return data;
};

export const transDay = (props) => {
	let value = props;
	let data;
	switch (value) {
		case "Mon":
			return (data = "(월)");
		case "Tue":
			return (data = "(화)");
		case "Wed":
			return (data = "(수)");
		case "Thu":
			return (data = "(목)");
		case "Fri":
			return (data = "(금)");
		case "Sat":
			return (data = "(토)");
		case "Sun":
			return (data = "(일)");
	}
	return data;
};