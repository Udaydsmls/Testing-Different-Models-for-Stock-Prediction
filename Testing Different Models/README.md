# Testing-Different-Models-for-Stock-Prediction

## In this project I've tried implementing different ML models and Parameters to predict stocks.
For this project I've used dataset from yahoo finance for "TATA MOTORS".

## Results from file Stock_Prediction.ipynb

### RNN using LSTM:
![image](https://github.com/user-attachments/assets/52b59d97-7d9e-4e5e-9619-a85f96182097)
The graph may not look very impressive, but with a higher range of data and better optimizations, the model can perform much better.

### Linear Regression:
![image](https://github.com/user-attachments/assets/39c79f15-097d-4ee9-98c0-ee7c150a29e3)
The results in this case are quite impressive; however, this might be because the model is not predicting that far into the future, which makes it uncertain how well it will perform in practice.

### ARIMA:
![image](https://github.com/user-attachments/assets/557a88d2-9b56-4491-a0bf-1c1c7e601214)
In ARIMA, you get an interval within which the future value is expected to lie.


## Results from file Stock_Prediction_Diff_Parameters.ipynb
To further improve the model, I tried adding some benchmarks, such as 'NIFTY'.

### Gradient Boosting:
![image](https://github.com/user-attachments/assets/6add268a-9f34-4a1e-8a11-caaa9e4a04f6)

### Linear Regression with more parameters:
![image](https://github.com/user-attachments/assets/fdc99ef7-bd1f-49c7-ba87-ce68ab47d10a)
This is nearly the same as the previous one, with no visible improvements.

To conclude,
1) RNN: The performance of this model is primarily suited for medium-term stock purchases. According to the current analysis, it has the potential to perform even better with different optimizations or over a longer data range.
2) Linear Regression: Impressive short-term predictions, though its near-term focus raises uncertainty for long-term performance.
3) ARIMA: In ARIMA, you receive an interval within which the future value is expected to lie. This provides a general idea of how a stock might perform, although it doesn't give an exact value. For long-term investments, this can be very helpful.
4) Gradient Boosting: This model provides a reasonably good representation of stock performance for a medium time frame, but it does not offer optimal predictions for short time periods. It can be useful for predicting stocks a few days into the future.


## My Future Ideas on how to further develope on this:
1) Check how the stock market is affected seasonally.
2) Analyze how people's sentiments affect the stock market (Sentiment Analysis).
3) Examine how US bond rates, gold prices, etc., affect the stock market.
4) See how indicators such as RSI and EMA can help improve these models
