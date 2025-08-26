package org.example;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JsonInput {

    private static Map<String, Long> minFlightTimesMap = new HashMap<>();


    /**
     * Основной метод запуска парсинга JSON-файла tickets.json
     */
    public static void parsing() {
        try {
            JSONObject jsonObject = readJsonFile("tickets.json");
            JSONArray jsonArray = (JSONArray) jsonObject.get("tickets");
            List<Ticket> ticketList = new ArrayList<>();
            parse(jsonArray, ticketList);
        } catch (IOException | ParseException e) {
            e.printStackTrace();
        }
    }

    /**
     * Читает JSON-файл с диска, удаляет "невидимый символ" (если есть) и возвращает JSON-объект.
     *
     * @param fileName наименование JSON-файла
     * @return JSONObject с содержимым файла
     * @throws IOException    если возникла ошибка чтения файла
     * @throws ParseException если содержимое не является корректным JSON
     */
    private static JSONObject readJsonFile(String fileName) throws IOException, ParseException {
        try (FileInputStream fileInputStream = new FileInputStream(fileName)) {
            String jsonString = new String(fileInputStream.readAllBytes(), StandardCharsets.UTF_8);

            if (jsonString.startsWith("\uFEFF")) {
                jsonString = jsonString.substring(1);
            }
            JSONParser parser = new JSONParser();
            return (JSONObject) parser.parse(jsonString);
        }
    }

    /**
     * Обрабатывает массив с билетами:
     * - парсит их;
     * - выводит минимальное время полета
     * - выводит разницу медду средней ценой и медианой
     *
     * @param jsonArray массив JSON-объектов с билетами
     * @param tickets   список, в который будут добавлены билеты
     */
    private static void parse(JSONArray jsonArray, List<Ticket> tickets) {
        parsingJsonArrayToList(jsonArray, tickets);

        for (Ticket ticket : tickets) {
            getMinTimeCarrier(ticket);
        }

        printMinTimeCarrier();
        printDifferenceAverageAndMedian(tickets);

    }

    /**
     * Выводит разницу между средней ценой и медианной ценой билетов
     * для рейса между Владивостоком и Тель-Авивом.
     *
     * @param tickets список билетов
     */
    private static void printDifferenceAverageAndMedian(List<Ticket> tickets) {
        System.out.println("Разница между средней ценой и " +
                "медианой для полета между городами Владивосток и Тель-Авив: " +
                calculationMedian(tickets));
    }

    /**
     * Вычисляет разницу между средней ценой билетов и их медианной.
     *
     * @param tickets список билетов
     * @return разница между средней ценой и медианной
     */
    private static double calculationMedian(List<Ticket> tickets) {
        double result = 0;
        for (Ticket ticket : tickets) {
            result += ticket.getPrice();
        }
        double averagePrice = result / tickets.size();
        double[] prices = tickets.stream()
                .mapToDouble(Ticket::getPrice)
                .sorted()
                .toArray();
        double median;
        if (prices.length % 2 == 0) {
            median = (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2;
        } else {
            median = prices[prices.length / 2];
        }
        return averagePrice - median;
    }

    /**
     * Выводит минимальное время полета для каждого перевозчика.
     */
    private static void printMinTimeCarrier() {
        for (Map.Entry<String, Long> entry : minFlightTimesMap.entrySet()) {
            System.out.println("Минимальное время для " + entry.getKey() + ": " + convertSecondsToHoursMinutes(entry.getValue()));
        }
    }

    /**
     * Конвертирует количество секунд в формат "дней часы:минуты:секунды".
     *
     * @param totalSeconds общее количество секунд
     * @return форматированное время
     */
    private static String convertSecondsToHoursMinutes(long totalSeconds) {
        int days = (int) (totalSeconds / (60 * 60 * 24));
        int remainingSeconds = (int) (totalSeconds % (60 * 60 * 24));

        int hours = remainingSeconds / 3600;
        remainingSeconds %= 3600;

        int minutes = remainingSeconds / 60;
        remainingSeconds %= 60;
        return String.format("%d дней %02d:%02d:%02d", days, hours, minutes, remainingSeconds);
    }

    /**
     * Преобразует JSON-массив билетов в список объектов Ticket.
     * Отбирает только рейсы Владивосток → Тель-Авив и инициализирует карту минимальных времен полета.
     *
     * @param jsonArray массив JSON-объектов
     * @param tickets   список билетов
     */
    private static void parsingJsonArrayToList(JSONArray jsonArray, List<Ticket> tickets) {
        for (Object ticket : jsonArray) {
            JSONObject jsonTicket = (JSONObject) ticket;
            String origin = (String) jsonTicket.get("origin");
            String originName = (String) jsonTicket.get("origin_name");
            String destination = (String) jsonTicket.get("destination");
            String destinationName = (String) jsonTicket.get("destination_name");
            String departureDate = (String) jsonTicket.get("departure_date");
            String departureTime = (String) jsonTicket.get("departure_time");
            String arrivalDate = (String) jsonTicket.get("arrival_date");
            String arrivalTime = (String) jsonTicket.get("arrival_time");
            String carrier = (String) jsonTicket.get("carrier");
            int stops = ((Long) jsonTicket.get("stops")).intValue();
            double price = ((Long) jsonTicket.get("price")).doubleValue();

            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yy");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

            departureTime = getCorrectTime(departureTime);
            arrivalTime = getCorrectTime(arrivalTime);

            LocalDate localDateDeparture = LocalDate.parse(departureDate, dateFormatter);
            LocalDate localDateArrival = LocalDate.parse(arrivalDate, dateFormatter);
            LocalTime localTimeArrival = LocalTime.parse(arrivalTime, timeFormatter);
            LocalTime localTimeDeparture = LocalTime.parse(departureTime, timeFormatter);

            if (originName.equals("Владивосток") && destinationName.equals("Тель-Авив")) {
                tickets.add(new Ticket(origin,
                        originName,
                        destination,
                        destinationName,
                        localDateDeparture,
                        localTimeDeparture,
                        localDateArrival,
                        localTimeArrival,
                        carrier,
                        stops,
                        price));
                minFlightTimesMap.put(carrier, Long.MAX_VALUE);
            }
        }
    }

    /**
     * Исправляет время, добавляя ведущий ноль, если оно имеет формат "H:mm".
     *
     * @param time строка времени
     * @return строка в формате "HH:mm"
     */
    private static String getCorrectTime(String time) {
        if (time.length() < 5) {
            time = "0" + time;
        }
        return time;
    }

    /**
     * Рассчитывает минимальное время полета для конкретного перевозчика
     * и обновляет его в minFlightTimesMap.
     *
     * @param ticket билет
     */
    private static void getMinTimeCarrier(Ticket ticket) {
        long days = ChronoUnit.DAYS.between(ticket.getDepartureDate(), ticket.getArrivalDate());
        long result = differenceBetween(ticket.getDepartureTime(), ticket.getArrivalTime(), days);

        String carrier = ticket.getCarrier();
        if (minFlightTimesMap.containsKey(carrier)) {
            long minFlightTime = minFlightTimesMap.get(carrier);
            minFlightTimesMap.put(carrier, getMinFlightTime(minFlightTime, result));
        } else {
            minFlightTimesMap.put(carrier, result);
        }
    }

    /**
     * Возвращает минимальное время
     *
     * @param minSeconds текущее минимальное значение
     * @param result     новое время полета
     * @return минимальное значение
     */
    private static long getMinFlightTime(long minSeconds, long result) {
        if (minSeconds == 0) {
            minSeconds = result;
        } else {
            if (minSeconds > result) {
                minSeconds = result;
            }
        }
        return minSeconds;
    }

    /**
     * Вычисляет разницу между time1 и time2.
     *
     * @param time1 время отправления
     * @param time2 время прибытия
     * @param days  количество дней между отправлением и прибытием
     * @return разница в секундах
     */
    public static long differenceBetween(LocalTime time1, LocalTime time2, long days) {
        if (days > 0) {
            long seconds = 86400 * days;
            return seconds + time1.until(time2, ChronoUnit.SECONDS);
        }
        return time1.until(time2, ChronoUnit.SECONDS);
    }

}
